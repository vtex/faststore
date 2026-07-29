import {
  LOCKS,
  agents,
  cmdExists,
  detect,
  getCommand,
  getVoltaPrefix,
} from '@antfu/ni'
import type { Agent } from '@antfu/ni'
import chalk from 'chalk'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { logger } from './logger'

export interface ResolvedPackageManager {
  /** Agent id, validated against `ni`'s known agents. For comparisons, never for execution. */
  agent: Agent
  /** Executable form for `spawn`/`spawnSync` with `shell: true`. May carry a Volta prefix. */
  command: string
  /** Executable form for `spawn` without a shell. */
  argv: [string, ...string[]]
}

export class UnknownAgentError extends Error {}

export class NoAvailablePackageManagerError extends Error {}

const DEFAULT_AGENT: Agent = 'yarn'
const FALLBACK_AGENTS: Agent[] = ['yarn', 'npm']

/**
 * Resolves the package manager to use for `cwd`.
 *
 * `programmatic: true` is what keeps `ni` from going interactive. Without it, an
 * agent that is not installed makes `ni` render a confirm prompt to stdout, and
 * callers interpolate this value straight into shell commands.
 */
export async function resolvePackageManager(
  cwd: string = process.cwd()
): Promise<ResolvedPackageManager> {
  const detected = (await detect({ programmatic: true, cwd })) ?? DEFAULT_AGENT

  if (!agents.includes(detected)) {
    throw new UnknownAgentError(
      `"${detected}" is not a known package manager. Expected one of: ${agents.join(
        ', '
      )}.`
    )
  }

  const agent = cmdExists(binOf(detected))
    ? detected
    : substituteAgent(detected, cwd)

  const voltaPrefix = getVoltaPrefix()
  const command = voltaPrefix ? `${voltaPrefix} ${binOf(agent)}` : binOf(agent)

  return { agent, command, argv: command.split(' ') as [string, ...string[]] }
}

/** Shell-ready form of {@link resolvePackageManager}, for callers that only run a command. */
export async function getPreferredPackageManager(
  cwd?: string
): Promise<string> {
  const { command } = await resolvePackageManager(cwd)

  return command
}

function binOf(agent: Agent): string {
  return getCommand(agent, 'agent')
}

function substituteAgent(detected: Agent, cwd: string): Agent {
  const available = FALLBACK_AGENTS.find((candidate) =>
    cmdExists(binOf(candidate))
  )

  if (!available) {
    throw new NoAvailablePackageManagerError(
      `Detected "${detected}", which is not installed, and none of ${FALLBACK_AGENTS.join(
        ', '
      )} is available either.`
    )
  }

  const lockfiles = Object.keys(LOCKS).filter((lockfile) =>
    existsSync(join(cwd, lockfile))
  )

  logger.warn(
    `${chalk.yellow(
      'warning'
    )} - Detected "${detected}" but it is not installed in this environment. Using "${available}" instead.` +
      (lockfiles.length > 1
        ? `\nMore than one lockfile is committed (${lockfiles.join(
            ', '
          )}). Keep a single one so the package manager is unambiguous.`
        : '')
  )

  return available
}
