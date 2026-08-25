import fsExtra from 'fs-extra'
import { createRequire } from 'node:module'
import path from 'node:path'

const { existsSync } = fsExtra

/**
 * Resolves a package's executable through Node's module resolution, starting
 * the lookup at `fromDir`.
 *
 * `withNodeModulesBins` can only order directories, so it runs whichever copy of
 * a binary the nearest ancestor `node_modules/.bin` happens to hold. That is not
 * necessarily the copy `@faststore/core` depends on: on a hoisted monorepo
 * another module's older Next can win the root `.bin` link, and the build then
 * fails on flags that version does not have. Module resolution follows the
 * dependency graph instead, so it returns the copy core would import — and it
 * still finds one where no ancestor `.bin` has it at all, as happens when a
 * package manager nests rather than hoists.
 *
 * Returns `undefined` when the specifier cannot be resolved, so callers can fall
 * back to the bare command name.
 */
export function resolvePackageBin(
  specifier: string,
  fromDir: string
): string | undefined {
  try {
    // createRequire needs a file path to anchor the lookup. The file itself does
    // not have to exist; only the directory it sits in is used.
    return createRequire(path.join(fromDir, 'noop.js')).resolve(specifier)
  } catch {
    return undefined
  }
}

function collectBinDirs(fromDir: string) {
  const binDirs: string[] = []
  let currentDir = path.resolve(fromDir)

  while (true) {
    const binDir = path.join(currentDir, 'node_modules', '.bin')

    if (existsSync(binDir)) {
      binDirs.push(binDir)
    }

    const parentDir = path.dirname(currentDir)

    if (parentDir === currentDir) {
      return binDirs
    }

    currentDir = parentDir
  }
}

// Environment variables are case-insensitive on Windows, where the key is
// usually `Path`. Reusing the existing key avoids handing the child process
// both `Path` and `PATH`.
function getPathKey(env: NodeJS.ProcessEnv) {
  return Object.keys(env).find((key) => key.toUpperCase() === 'PATH') ?? 'PATH'
}

/**
 * Prepends the `node_modules/.bin` of `fromDir` and of every ancestor
 * directory to `PATH`.
 *
 * The generated `.faststore` package has no `node_modules` of its own, so the
 * binaries its scripts call (`na`, `next`) live higher up the tree: in the
 * store root or, on hoisted monorepos, the workspace root.
 */
export function withNodeModulesBins(
  fromDir: string,
  env: NodeJS.ProcessEnv = process.env
): NodeJS.ProcessEnv {
  const binDirs = collectBinDirs(fromDir)

  if (binDirs.length === 0) {
    return { ...env }
  }

  const pathKey = getPathKey(env)
  const currentEntries = env[pathKey]?.split(path.delimiter) ?? []
  // Package managers already put some of these directories in PATH when they
  // run a script, but not necessarily nearest first. Dropping their copies
  // before prepending `binDirs` keeps the nearest ancestor in charge instead
  // of letting a farther one that was missing from PATH jump ahead of it.
  const binDirSet = new Set(binDirs)
  const otherEntries = currentEntries.filter((entry) => !binDirSet.has(entry))

  return {
    ...env,
    [pathKey]: [...binDirs, ...otherEntries].join(path.delimiter),
  }
}
