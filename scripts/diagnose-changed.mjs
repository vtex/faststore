#!/usr/bin/env node
// Diagnostic (non-blocking): reports whether Lerna would find any changed
// package to version on the current branch. It makes the "No changed packages
// to version" situation obvious in the CI log — with a clear reason — instead
// of a silent no-op that people misread as a broken release.
//
// This does NOT gate the release. The release scripts force-publish (dev/v3) or
// force-conventional-graduate (main), so packages are still published even when
// Lerna reports no natural changes; this step only explains what is happening.

import { execFileSync } from 'node:child_process'

function run(cmd, args) {
  try {
    return { code: 0, out: execFileSync(cmd, args, { encoding: 'utf8' }) }
  } catch (err) {
    return {
      code: err.status ?? 1,
      out: `${err.stdout ?? ''}${err.stderr ?? ''}`,
    }
  }
}

// `lerna changed` lists packages with changes since the last release tag and
// exits non-zero when there are none.
const { code, out } = run('pnpm', ['exec', 'lerna', 'changed', '--long'])
if (out.trim()) process.stdout.write(`${out.trimEnd()}\n`)

const nothingChanged = code !== 0 || /No changed packages/i.test(out)

if (nothingChanged) {
  const reason =
    'No changed packages to version. The commit likely only touched files ' +
    'outside packages/ or matched lerna.json > ignoreChanges ' +
    '(**/*.md, **/*.test.*, **/*.snap, **/__fixtures__/**). ' +
    'The release still force-publishes all packages, so the version moves only ' +
    'by the prerelease/graduate counter — confirm this is intended.'
  console.log(`::warning title=No changed packages to version::${reason}`)
} else {
  console.log(
    'Changed packages detected — the release will version real changes.'
  )
}

// Always succeed: this is an informational diagnostic, not a gate.
process.exit(0)
