import { spawnSync } from 'node:child_process'

// Retrieves the package manager based on the developer lockfile, using `ni`.
export function getPreferredPackageManager() {
  const agent = spawnSync('na', ['?'], {
    encoding: 'utf8',
    shell: true,
  }).stdout.trim()

  if (agent === '') return 'yarn' // Default to Yarn

  return agent
}
