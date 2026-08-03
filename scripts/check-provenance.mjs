#!/usr/bin/env node
// Informational (non-blocking): flags FastStore packages whose latest published
// version has no npm provenance/attestation. A missing attestation usually means
// the last publish was done manually (personal account / token) instead of via
// the CD OIDC Trusted Publisher — the exact gap that broke @faststore/diagnostics
// during the v4 launch (E404 then E422).
//
// There is no clean public API to read the Trusted Publisher configuration, so
// this infers it from the presence of a provenance attestation on the latest
// published version. It never fails the build; it only surfaces a warning so a
// maintainer can configure the Trusted Publisher before the next CI release.

import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const PACKAGES_DIR = resolve(__dirname, '..', 'packages')

function publicPackageNames() {
  return readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(PACKAGES_DIR, entry.name, 'package.json'))
    .map((path) => {
      try {
        return JSON.parse(readFileSync(path, 'utf8'))
      } catch {
        return null
      }
    })
    .filter((pkg) => pkg && !pkg.private && pkg.name)
    .map((pkg) => pkg.name)
}

function npmView(spec, field) {
  try {
    const args = ['view', spec]
    if (field) args.push(field)
    args.push('--json')
    return execFileSync('npm', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return ''
  }
}

const flagged = []
const ok = []
const skipped = []

for (const name of publicPackageNames()) {
  const latestRaw = npmView(name, 'dist-tags.latest')
  if (!latestRaw) {
    skipped.push(`${name} (no latest dist-tag / not published)`)
    continue
  }
  const latest = JSON.parse(latestRaw)
  const attestations = npmView(`${name}@${latest}`, 'dist.attestations')

  if (attestations && attestations !== 'null' && attestations !== '{}') {
    ok.push(`${name}@${latest}`)
  } else {
    flagged.push(`${name}@${latest}`)
  }
}

console.log('npm provenance check (latest dist-tag):')
for (const p of ok) console.log(`  ok:       ${p}`)
for (const p of skipped) console.log(`  skipped:  ${p}`)
for (const p of flagged) console.log(`  NO prov:  ${p}`)

if (flagged.length > 0) {
  const list = flagged.join(', ')
  console.log(
    `::warning title=Missing npm provenance::${list} — the latest published ` +
      'version has no provenance/attestation, which usually means a manual ' +
      'publish rather than the CD OIDC Trusted Publisher. Configure the ' +
      'Trusted Publisher for these packages before the next CI release to ' +
      'avoid E404/E422 failures.'
  )
}

// Always succeed: informational check only.
process.exit(0)
