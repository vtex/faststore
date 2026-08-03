/**
 * Preflight checks for the `vtex` toolbelt used by the CP flow of `cms-sync`.
 *
 * The CP flow shells out to `vtex content generate-schema`/`upload-schema`. If
 * the toolbelt is missing, the user is logged out, or logged into the wrong
 * account, those commands either fail opaquely or stall on an interactive login
 * prompt before the dev can answer the real schema prompts. Running these
 * checks first surfaces an actionable error (install / `vtex login` /
 * `vtex switch`) up front, against the store's `api.storeId`.
 */
import { execSync } from 'node:child_process'
import chalk from 'chalk'
import { logger } from './logger'

/**
 * Runs a command capturing its merged stdout/stderr.
 * Returns null when the command fails to run or exits non-zero.
 */
function runCapture(cmd: string): string | null {
  try {
    return execSync(`${cmd} 2>&1`, { stdio: 'pipe' }).toString()
  } catch {
    return null
  }
}

/** Whether the `vtex` toolbelt is available on the PATH. */
export function isVtexCliInstalled(): boolean {
  return runCapture('vtex --version') !== null
}

/**
 * Extracts the logged-in account from `vtex whoami` output.
 * Returns null when the output indicates a logged-out state or can't be parsed.
 *
 * Handles the toolbelt formats observed in practice, e.g.:
 *   - "Logged into brandless as user@vtex.com at workspace master"
 *   - "user@vtex.com @ brandless / master"
 */
export function parseAccountFromWhoami(output: string): string | null {
  if (/not logged|isn't logged|no user|please login/i.test(output)) {
    return null
  }

  const patterns = [
    /@\s+([\w.-]+)\s*\//, // "user@vtex.com @ brandless / master"
    /logged in(?:to)?\s+(?:account\s+)?([\w.-]+)/i, // "Logged into brandless ..."
    /account[:\s]+([\w.-]+)/i, // "... account brandless ..."
  ]

  for (const pattern of patterns) {
    const match = output.match(pattern)
    if (match?.[1]) {
      return match[1]
    }
  }

  return null
}

/** Returns the account currently logged into the toolbelt, or null. */
export function getLoggedVtexAccount(): string | null {
  const output = runCapture('vtex whoami')

  if (!output) {
    return null
  }

  return parseAccountFromWhoami(output)
}

/**
 * Ensures the `vtex` toolbelt is installed and authenticated against the
 * store's account before running CP schema commands. Exits the process with an
 * actionable message when any check fails.
 *
 * @param account - The store account from `discovery.config.js` (`api.storeId`).
 */
export function assertVtexReadyForAccount(account?: string): void {
  if (!isVtexCliInstalled()) {
    logger.error(
      `${chalk.red('[Error]')} - The VTEX toolbelt (\`vtex\`) was not found. Install it with ${chalk.bold('npm i -g vtex')} and try again.\n` +
        `${chalk.dim('Docs: https://developers.vtex.com/docs/guides/vtex-io-documentation-vtex-io-cli-installation-and-command-reference')}`
    )
    process.exit(1)
    return
  }

  const loggedAccount = getLoggedVtexAccount()
  const loginHint = account ? `vtex login ${account}` : 'vtex login <account>'

  if (!loggedAccount) {
    logger.error(
      `${chalk.red('[Error]')} - You are not logged into the VTEX toolbelt.\n` +
        `${chalk.cyan('Required Action:')} log into the store account by running ${chalk.bold(loginHint)}.`
    )
    process.exit(1)
    return
  }

  if (account && loggedAccount.toLowerCase() !== account.toLowerCase()) {
    logger.error(
      `${chalk.red('[Error]')} - You are logged into ${chalk.bold(loggedAccount)}, but this store targets ${chalk.bold(account)} (\`api.storeId\` in discovery.config.js).\n` +
        `${chalk.cyan('Required Action:')} switch accounts with ${chalk.bold(`vtex switch ${account}`)} or ${chalk.bold(loginHint)}.`
    )
    process.exit(1)
  }
}
