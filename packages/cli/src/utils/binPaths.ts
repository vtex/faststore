import fsExtra from 'fs-extra'
import path from 'node:path'

const { existsSync } = fsExtra

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
  // run a script, so skip the ones that are there.
  const missingBinDirs = binDirs.filter(
    (binDir) => !currentEntries.includes(binDir)
  )

  return {
    ...env,
    [pathKey]: [...missingBinDirs, ...currentEntries].join(path.delimiter),
  }
}
