#!/usr/bin/env node
/**
 * Sets up Claude Code so it reads the same skills/commands/rules as the
 * other agent tooling, by symlinking `.claude/{skills,commands,rules}`
 * to the matching folders under `.agents/`.
 *
 * - Idempotent: safe to run multiple times.
 * - Skips silently when the source `.agents/` folder is missing.
 * - On platforms where symlinks are not permitted (e.g. Windows without
 *   developer mode), logs a warning instead of failing.
 */

import { existsSync, lstatSync, mkdirSync, readlinkSync, rmSync, symlinkSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')
const agentsDir = join(repoRoot, '.agents')
const claudeDir = join(repoRoot, '.claude')

const links = ['skills', 'commands', 'rules']

if (!existsSync(agentsDir)) {
  console.log('[setup-claude] .agents/ not found; skipping.')
  process.exit(0)
}

mkdirSync(claudeDir, { recursive: true })

for (const name of links) {
  const target = join(agentsDir, name)
  const linkPath = join(claudeDir, name)
  const relativeTarget = relative(claudeDir, target)

  if (!existsSync(target)) {
    console.warn(`[setup-claude] target missing: ${relative(repoRoot, target)} (skipped)`)
    continue
  }

  if (existsSync(linkPath) || isBrokenSymlink(linkPath)) {
    const stats = lstatSync(linkPath)
    if (stats.isSymbolicLink()) {
      const current = readlinkSync(linkPath)
      if (current === relativeTarget) continue
    }
    rmSync(linkPath, { recursive: true, force: true })
  }

  try {
    symlinkSync(relativeTarget, linkPath, 'dir')
    console.log(`[setup-claude] linked .claude/${name} -> ${relativeTarget}`)
  } catch (err) {
    console.warn(
      `[setup-claude] could not create symlink .claude/${name} (${err.code ?? err.message}); skipping.`
    )
  }
}

function isBrokenSymlink(path) {
  try {
    return lstatSync(path).isSymbolicLink()
  } catch {
    return false
  }
}
