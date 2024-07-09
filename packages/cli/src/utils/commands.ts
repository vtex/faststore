import { spawnSync } from "node:child_process"

/**
* WIP: Retrieves the package manager based on the developer lockfile, using `ni`.
*/
export function getPreferredPackageManager() {
  const agent = spawnSync("na", ['\?'], { encoding: 'utf8' }).stdout.trim()

  return agent
}
