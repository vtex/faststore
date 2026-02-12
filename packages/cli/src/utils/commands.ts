import fsExtra from 'fs-extra'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import resolvePackage from 'resolve-pkg'

const { existsSync } = fsExtra

// Retrieves the package manager based on the developer lockfile, using `ni`.
export async function getPreferredPackageManager() {
  let agent = 'yarn' // Default to Yarn
  const binNA = join(
    await getPackageRootDir('@antfu/ni'),
    (await getDepPackageJSON('@antfu/ni'))?.bin?.['na'] ?? ''
  )

  if (fsExtra.existsSync(binNA) == false) return agent

  agent = spawnSync('node', [binNA, '?'], { encoding: 'utf-8' })?.stdout.trim()

  return agent
}

export async function getPackageRootDir(
  pkg: string,
  cwd: string | undefined = process.cwd(),
  depth = 20
) {
  let pkgPath = resolvePackage(pkg, { cwd })

  if (!pkgPath) throw new Error(`Couldn't resolve package ${pkg}`)

  let pkgJson = await loadPackageJsonAt(pkgPath)
  while (pkgJson?.name !== pkg && depth > 0) {
    pkgPath = join(pkgPath, '..')
    pkgJson = await loadPackageJsonAt(join(pkgPath, '..'))
  }

  if (pkgJson?.name !== pkg)
    throw new Error(`Maximum depth search for package ${pkg} root exceed`)

  return pkgPath
}

async function loadPackageJsonAt(at?: string): Promise<
  | undefined
  | (Record<string, unknown> & {
      name: string
      dependencies?: Record<string, string>
      peerDependencies?: Record<string, string>
      bin: Record<string, string>
    })
> {
  const file = 'package.json',
    location = (at?.endsWith(file) && at) || (at && join(at, file)) || false

  if (location === false)
    throw new Error(`Invalid searching of ${file} at ${at}`)

  if (!existsSync(location)) return

  const content = await import(location, {
    with: { type: 'json' },
  })

  return content.default ?? content ?? {}
}

export async function getDepPackageJSON(pkg: string) {
  return await loadPackageJsonAt(await getPackageRootDir(pkg))
}
