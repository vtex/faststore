#! /usr/bin/env node

const path = require('path')
const fs = require('fs')
const [, , basePath, packageToResolve, versionResolution] = process.argv

if (!basePath || !packageToResolve || !versionResolution) {
  console.error(
    'Usage: set-resolution <basePath> <packageToResolve> <versionResolution>'
  )
  process.exit(1)
}

const packageJsonPath = path.resolve(process.cwd(), basePath, 'package.json')

if (!fs.existsSync(packageJsonPath)) {
  console.error(`Error: package.json not found at ${packageJsonPath}`)
  process.exit(1)
}

const packageJson = require(packageJsonPath)

packageJson.resolutions = {
  ...packageJson.resolutions,
  [packageToResolve]: versionResolution,
}

if (packageJson.devDependencies[packageToResolve]) {
  packageJson.devDependencies[packageToResolve] = versionResolution
} else if (packageJson.dependencies[packageToResolve]) {
  packageJson.dependencies[packageToResolve] = versionResolution
} else {
  console.info(
    `${packageToResolve} is not a dependence of the specified project`
  )
  // process.exit(0)
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
