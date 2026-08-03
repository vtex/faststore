#!/usr/bin/env node
// Verifies that the package manifests we are about to publish are safe to
// upload to the npm registry. Two guards run per package:
//
//  1. No unresolved `workspace:` / `catalog:` protocols. These are pnpm
//     workspace primitives that MUST be rewritten to concrete versions before
//     publish; shipping them breaks installation for consumers outside this
//     monorepo.
//  2. A valid `repository.url` that matches this repo. npm provenance (OIDC
//     Trusted Publisher) compares the manifest repo against the CI repo, so a
//     missing/empty/mismatched `repository.url` fails publish with `E422`
//     (the exact failure that hit `@faststore/diagnostics` in the v4 launch).
//
// Strategy: pack every non-private package in `packages/*` with `pnpm pack`
// (which is the same code path `pnpm publish` uses to produce the tarball)
// and inspect the `package/package.json` entry inside each tarball.
//
// Exits with status 1 if any guard fails, so it can be wired into CI as a
// guard before the actual publish step.

import { execFileSync } from 'node:child_process'
import {
  createReadStream,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createGunzip } from 'node:zlib'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const PACKAGES_DIR = join(ROOT, 'packages')

const FORBIDDEN_PROTOCOLS = ['workspace:', 'catalog:']
const DEP_FIELDS = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
]

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

// Normalize a git/repository URL for comparison: drop the `git+` prefix, a
// trailing `.git`, and any trailing slash. Accepts a string or the object form
// (`{ type, url, directory }`).
function normalizeRepoUrl(repository) {
  const raw =
    typeof repository === 'string' ? repository : (repository?.url ?? '')
  return raw
    .trim()
    .replace(/^git\+/, '')
    .replace(/\.git$/, '')
    .replace(/\/$/, '')
}

// The repository URL every published package must point at. Read from the root
// manifest so this script stays repo-agnostic (works on forks/mirrors too).
const EXPECTED_REPO_URL = normalizeRepoUrl(
  readJson(join(ROOT, 'package.json')).repository
)

function listPublicPackages() {
  return readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(PACKAGES_DIR, entry.name))
    .filter((dir) => {
      const pkgJsonPath = join(dir, 'package.json')
      try {
        const pkg = readJson(pkgJsonPath)
        return !pkg.private && pkg.name
      } catch {
        return false
      }
    })
}

function pack(pkgDir, destination) {
  try {
    execFileSync('pnpm', ['pack', '--pack-destination', destination], {
      cwd: pkgDir,
      stdio: 'pipe',
      encoding: 'utf8',
    })
  } catch (err) {
    const stdout = err.stdout?.toString() ?? ''
    const stderr = err.stderr?.toString() ?? ''
    const message = (stderr || stdout).trim()
    throw new Error(
      `\`pnpm pack\` failed in ${pkgDir}.\n${message}\n\n` +
        'Hint: this script requires dependencies to be installed. ' +
        'Run `pnpm install` first.'
    )
  }
}

async function readManifestFromTarball(tarballPath) {
  // Streaming gunzip + minimal tar parser, just enough to extract
  // `package/package.json` without pulling extra deps.
  const gunzip = createGunzip()
  const stream = createReadStream(tarballPath).pipe(gunzip)

  const chunks = []
  for await (const chunk of stream) chunks.push(chunk)
  const buffer = Buffer.concat(chunks)

  let offset = 0
  while (offset + 512 <= buffer.length) {
    const header = buffer.subarray(offset, offset + 512)
    const name = header.subarray(0, 100).toString('utf8').replace(/\0.*$/, '')
    if (!name) break

    const sizeStr = header
      .subarray(124, 136)
      .toString('utf8')
      .replace(/\0.*$/, '')
      .trim()
    const size = Number.parseInt(sizeStr, 8) || 0
    const blocks = Math.ceil(size / 512)
    const dataStart = offset + 512

    if (name === 'package/package.json') {
      return buffer.subarray(dataStart, dataStart + size).toString('utf8')
    }

    offset = dataStart + blocks * 512
  }

  throw new Error(`package/package.json not found in ${tarballPath}`)
}

function findUnresolvedProtocols(manifest) {
  const offenders = []
  for (const field of DEP_FIELDS) {
    const deps = manifest[field]
    if (!deps) continue
    for (const [name, version] of Object.entries(deps)) {
      if (typeof version !== 'string') continue
      if (FORBIDDEN_PROTOCOLS.some((p) => version.startsWith(p))) {
        offenders.push({ field, name, version })
      }
    }
  }
  return offenders
}

// Returns an array of human-readable problems with the manifest's `repository`
// field (empty array means it is valid).
function findRepositoryProblems(manifest, expectedDir) {
  if (!EXPECTED_REPO_URL) return [] // no root repo url to compare against

  const problems = []
  const repository = manifest.repository
  const url = normalizeRepoUrl(repository)

  if (!url) {
    problems.push('repository.url is missing or empty')
  } else if (url !== EXPECTED_REPO_URL) {
    problems.push(`repository.url = "${url}" (expected "${EXPECTED_REPO_URL}")`)
  }

  // `repository.directory` is optional, but when present it must point at the
  // package's own folder so provenance/tooling can locate the source.
  if (repository && typeof repository === 'object' && repository.directory) {
    if (repository.directory !== expectedDir) {
      problems.push(
        `repository.directory = "${repository.directory}" (expected "${expectedDir}")`
      )
    }
  }

  return problems
}

async function main() {
  const packages = listPublicPackages()
  if (packages.length === 0) {
    console.error('No public packages found under packages/.')
    process.exit(1)
  }

  const stagingDir = mkdtempSync(join(tmpdir(), 'faststore-verify-'))
  console.log(`Packing ${packages.length} package(s) into ${stagingDir}\n`)

  let failed = false

  try {
    for (const pkgDir of packages) {
      const pkg = readJson(join(pkgDir, 'package.json'))
      process.stdout.write(`• ${pkg.name}@${pkg.version} ... `)

      pack(pkgDir, stagingDir)

      const tarballs = readdirSync(stagingDir).filter((f) => f.endsWith('.tgz'))
      const matching = tarballs.find((f) =>
        f.startsWith(`${pkg.name.replace('@', '').replace('/', '-')}-`)
      )
      if (!matching) {
        console.log('FAIL')
        console.error(`  No tarball produced for ${pkg.name}`)
        failed = true
        continue
      }

      const manifestRaw = await readManifestFromTarball(
        join(stagingDir, matching)
      )
      const manifest = JSON.parse(manifestRaw)
      const offenders = findUnresolvedProtocols(manifest)
      const expectedDir = `packages/${basename(pkgDir)}`
      const repoProblems = findRepositoryProblems(manifest, expectedDir)

      if (offenders.length > 0 || repoProblems.length > 0) {
        console.log('FAIL')
        for (const { field, name, version } of offenders) {
          console.error(`  ${field}.${name} = "${version}"`)
        }
        for (const problem of repoProblems) {
          console.error(`  ${problem}`)
        }
        failed = true
      } else {
        console.log('OK')
      }
    }
  } finally {
    rmSync(stagingDir, { recursive: true, force: true })
  }

  if (failed) {
    console.error(
      '\nOne or more manifests are not safe to publish:\n' +
        '  • Unresolved workspace:/catalog: protocols — make sure release\n' +
        '    scripts use `pnpm -r publish` (not `lerna publish` / `npm publish`)\n' +
        '    so the protocols are rewritten before upload.\n' +
        `  • repository.url must match "${EXPECTED_REPO_URL}" (and\n` +
        '    repository.directory must point at the package) — a missing or\n' +
        '    mismatched value fails npm provenance with E422.'
    )
    process.exit(1)
  }

  console.log('\nAll publishable manifests are clean.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
