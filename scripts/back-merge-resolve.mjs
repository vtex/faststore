#!/usr/bin/env node
// Resolves the *deterministic* merge conflicts produced when back-merging
// `main` into `dev` (after a release). It is meant to run while a `git merge`
// is in progress with conflicts, and it only touches conflicts whose
// resolution is unambiguous:
//
//  1. Version fields — `lerna.json` and every `packages/*/package.json`. In
//     fixed mode the only conflicting hunk is `version`; we take the stable
//     value from `main` (theirs) while keeping every other dev-side change in
//     the file (new deps, scripts, etc.).
//  2. CHANGELOGs — `CHANGELOG.md` and `packages/*/CHANGELOG.md`. Both sides
//     only ever *prepend* entries, so we union the conflicting blocks (ours
//     first, then any theirs line not already present), never deleting an
//     entry. This preserves `[no ci] Release: X.Y.Z` lines from both sides.
//
// Anything else (source files, generated files, lockfile) is intentionally
// left untouched — the workflow regenerates generated files / the lockfile and
// flags any remaining conflict for manual review. The script prints a summary
// and always exits 0; the caller decides what to do with leftover conflicts.

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

function git(args, opts = {}) {
  return execFileSync('git', args, { encoding: 'utf8', ...opts })
}

function unmergedFiles() {
  const out = git(['diff', '--name-only', '--diff-filter=U'])
  return out
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function isVersionFile(file) {
  return file === 'lerna.json' || /^packages\/[^/]+\/package\.json$/.test(file)
}

function isChangelog(file) {
  return (
    file === 'CHANGELOG.md' || /^packages\/[^/]+\/CHANGELOG\.md$/.test(file)
  )
}

// Read a specific merge stage of a conflicted file. Stage 2 = ours (dev),
// stage 3 = theirs (main). Returns null when the stage is absent.
function readStage(stage, file) {
  try {
    return git(['show', `:${stage}:${file}`])
  } catch {
    return null
  }
}

// Take the dev-side manifest as the base (keeps dev-only edits) and only
// overwrite `version` with the stable value coming from main.
function resolveVersionFile(file) {
  const ours = readStage(2, file)
  const theirs = readStage(3, file)
  if (ours == null || theirs == null) return false

  const oursJson = JSON.parse(ours)
  const theirsJson = JSON.parse(theirs)
  if (typeof theirsJson.version !== 'string') return false

  oursJson.version = theirsJson.version

  // Preserve trailing newline style used across the repo manifests.
  writeFileSync(file, `${JSON.stringify(oursJson, null, 2)}\n`)
  git(['add', '--', file])
  return theirsJson.version
}

// Union the two sides of every conflict block, ours first, appending theirs
// lines that are not already present (dedupe by trimmed, non-empty content).
function unionResolveContent(content) {
  const lines = content.split('\n')
  const out = []
  let i = 0

  while (i < lines.length) {
    if (lines[i].startsWith('<<<<<<<')) {
      i++ // skip the "<<<<<<< ours" marker
      const ours = []
      while (
        i < lines.length &&
        !lines[i].startsWith('|||||||') &&
        !lines[i].startsWith('=======')
      ) {
        ours.push(lines[i])
        i++
      }
      // Skip an optional diff3 base section (||||||| ... =======).
      if (i < lines.length && lines[i].startsWith('|||||||')) {
        i++
        while (i < lines.length && !lines[i].startsWith('=======')) i++
      }
      i++ // skip the "=======" marker
      const theirs = []
      while (i < lines.length && !lines[i].startsWith('>>>>>>>')) {
        theirs.push(lines[i])
        i++
      }
      i++ // skip the ">>>>>>>" marker

      const merged = [...ours]
      const seen = new Set(
        ours.map((l) => l.trim()).filter((l) => l.length > 0)
      )
      for (const line of theirs) {
        const key = line.trim()
        if (key.length > 0 && seen.has(key)) continue
        if (key.length > 0) seen.add(key)
        merged.push(line)
      }
      out.push(...merged)
    } else {
      out.push(lines[i])
      i++
    }
  }

  return out.join('\n')
}

function resolveChangelog(file) {
  // The working-tree copy still holds the conflict markers written by git.
  let raw
  try {
    raw = readFileSync(file, 'utf8')
  } catch {
    return false
  }
  const resolved = unionResolveContent(raw)
  writeFileSync(file, resolved)
  git(['add', '--', file])
  return true
}

function main() {
  const conflicts = unmergedFiles()
  if (conflicts.length === 0) {
    console.log('No conflicts to resolve.')
    return
  }

  const resolvedVersions = []
  const resolvedChangelogs = []
  const skipped = []

  for (const file of conflicts) {
    if (isVersionFile(file)) {
      const version = resolveVersionFile(file)
      if (version) resolvedVersions.push(`${file} -> ${version}`)
      else skipped.push(file)
    } else if (isChangelog(file)) {
      if (resolveChangelog(file)) resolvedChangelogs.push(file)
      else skipped.push(file)
    } else {
      skipped.push(file)
    }
  }

  console.log('Back-merge deterministic resolution summary:')
  console.log(`  version files resolved: ${resolvedVersions.length}`)
  for (const v of resolvedVersions) console.log(`    ${v}`)
  console.log(`  CHANGELOGs unioned:     ${resolvedChangelogs.length}`)
  for (const c of resolvedChangelogs) console.log(`    ${c}`)
  if (skipped.length > 0) {
    console.log(`  left for the workflow:  ${skipped.length}`)
    for (const s of skipped) console.log(`    ${s}`)
  }
}

main()
