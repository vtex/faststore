#! /usr/bin/env node

import startPackage from '../apps/starter/package.json' with { type: 'json' }
import corePackage from '../packages/core/package.json' with { type: 'json' }
import apiPackage from '../packages/api/package.json' with { type: 'json' }
import sdkPackage from '../packages/sdk/package.json' with { type: 'json' }
import componentsPackage from '../packages/components/package.json' with {
  type: 'json',
}
import uiPackage from '../packages/ui/package.json' with { type: 'json' }
import cliPackage from '../packages/cli/package.json' with { type: 'json' }

const depsMap = new Map()
const projects = [
  // startPackage,
  corePackage,
  apiPackage,
  sdkPackage,
  componentsPackage,
  uiPackage,
  cliPackage,
]

const [setMetadata, getMetadata] = (() => {
  // const index = 1
  const namesMap = new Map()
  const getMetadata = (name) => namesMap.get(name)
  const setMetadata = (name, version) => {
    const id = String(name).replaceAll(/\W/gi, '-')
    namesMap.set(name, {
      id: `node${id}`,
      versions: (namesMap.get(name)?.versions ?? []).concat(version),
    })

    return namesMap.get(name)
  }

  return [setMetadata, getMetadata]
})()

/**
 * @param {Array<{dependencies: Record<string, string>, devDependencies: Record<string, string>, name: string, version: string}>} projects
 * @param {Map<string, Array<string>>} depsMap
 */
function listDeps(projects, depsMap) {
  for (const { devDependencies, dependencies, name, version } of projects) {
    const allDeps = []
    for (const [dep, v] of Object.entries({
      ...devDependencies,
      ...dependencies,
    })) {
      allDeps.push(dep)
      setMetadata(dep, v)
    }
    depsMap.set(name, allDeps)
    setMetadata(name, version)
  }
}
/**
 *
 * @param {Map<string, Array<string>>} depsMap
 */
function buildGraph(depsMap) {
  const flowChart = [`---\nconfig:\n  theme: neo-dark\n---`, 'flowchart TB']
  const placed = []
  for (const [project, deps] of depsMap.entries()) {
    const projectMetadata = getMetadata(project)
    flowChart.push(
      `    ${projectMetadata?.id}@{shape: stadium, label: "${project}: (${projectMetadata?.versions?.join(', ')})"}`
    )

    for (const dep of deps) {
      const depMetadata = getMetadata(dep)
      if (placed.includes(depMetadata?.id)) continue
      flowChart.push(
        `    ${depMetadata?.id}@{shape: stadium, label: "${dep}: (${depMetadata?.versions?.join(', ')})"}`
      )
      placed.push(depMetadata?.id)
    }
    for (const dep of deps) {
      const depMetadata = getMetadata(dep)
      flowChart.push(`    ${projectMetadata?.id} --> ${depMetadata?.id}`)
    }
  }

  return flowChart.join('\n')
}

listDeps(projects, depsMap)
console.log(buildGraph(depsMap))
