#!/usr/bin/env node
/**
 * Read-only check that the FastStore spec-kit symlinks (`.specify`, `.cursor`,
 * `specs`) are present at the repository root. These come from the private
 * `faststore-dx-spec-kit` repository via its `link.sh` script and are required
 * for SDD Full commands (`/speckit.*`).
 *
 * If anything is missing or broken, the script prints a friendly warning and
 * exits with status code 0 — it does not block setup, since OSS contributors
 * do not have access to the spec-kit and SDD Full is optional.
 */

import { existsSync, lstatSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')

const specKitLinks = ['.specify', '.cursor', 'specs']
const missing = []
const broken = []

for (const name of specKitLinks) {
  const linkPath = join(repoRoot, name)
  let stats
  try {
    stats = lstatSync(linkPath)
  } catch {
    missing.push(name)
    continue
  }
  if (stats.isSymbolicLink() && !existsSync(linkPath)) {
    broken.push(name)
  }
}

if (missing.length === 0 && broken.length === 0) {
  process.exit(0)
}

console.warn(
  '[check-spec-kit] FastStore spec-kit symlinks are not fully configured.'
)
if (missing.length > 0) {
  console.warn(`  missing: ${missing.join(', ')}`)
}
if (broken.length > 0) {
  console.warn(`  broken : ${broken.join(', ')}`)
}
console.warn(
  '  SDD Full commands (/speckit.*) need these to operate. Internal contributors:'
)
console.warn(
  '  run `./link.sh <path-to-faststore>` from the faststore-dx-spec-kit repo.'
)
console.warn(
  '  OSS contributors can ignore this warning — SDD Full is optional.'
)
