#!/usr/bin/env node
// Verifies that the package manifests we are about to publish do not contain
// unresolved `workspace:` or `catalog:` protocols. These protocols are pnpm
// workspace primitives that MUST be rewritten to concrete versions before a
// package is uploaded to the npm registry. Publishing them as-is breaks
// installation for any consumer outside of this monorepo.
//
// Strategy: pack every non-private package in `packages/*` with `pnpm pack`
// (which is the same code path `pnpm publish` uses to produce the tarball)
// and inspect the `package/package.json` entry inside each tarball.
//
// Exits with status 1 if any unresolved protocol is found, so it can be wired
// into CI as a guard before the actual publish step.

import { execFileSync } from 'node:child_process'
import {
  createReadStream,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
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

      if (offenders.length > 0) {
        console.log('FAIL')
        for (const { field, name, version } of offenders) {
          console.error(`  ${field}.${name} = "${version}"`)
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
      '\nUnresolved workspace:/catalog: protocols would be published.\n' +
        'Make sure release scripts use `pnpm -r publish` (not `lerna publish` /\n' +
        '`npm publish`) so the protocols are rewritten before upload.'
    )
    process.exit(1)
  }

  console.log('\nAll publishable manifests are clean.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
