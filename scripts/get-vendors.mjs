#!/usr/bin/env node

import { existsSync, lstatSync, mkdirSync, writeFileSync } from 'node:fs'
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, join, basename, resolve } from 'node:path'

const REGISTRY =
  'https://main-053131491888.d.codeartifact.us-east-1.amazonaws.com/npm/observability'
const VENDORS = [
  { name: '@vtex/diagnostics-nodejs', version: '5.1.9' },
  { name: '@vtex/diagnostics-semconv', version: '5.1.4' },
]

async function main(vendors = VENDORS) {
  if (!process.env.CA_TOKEN)
    throw new Error(
      'Code Artifact token (CA_TOKEN) variable empty. Please authenticate before using this script'
    )

  let [, , downloadLocation] = process.argv

  if (!existsSync(downloadLocation)) {
    downloadLocation = resolve(
      process.env.PWD ?? process.cwd(),
      downloadLocation
    )
    mkdirSync(downloadLocation, { recursive: true })
  }

  if (
    !existsSync(downloadLocation) ||
    !lstatSync(downloadLocation).isDirectory()
  ) {
    const err = new Error(
      `Directory location doesn't exists. ${downloadLocation}`
    )
    console.error(err.message)
    throw err
  }

  for (const { name, version } of vendors) {
    const buffer = await downloadPackage(name, version)
    const filename = basename(
      `${name.replace('@', '').replace('/', '-')}-${version}.tgz`
    )
    const destination = join(downloadLocation, filename)
    mkdirSync(dirname(destination), { recursive: true })
    writeFileSync(destination, buffer)
    console.log(`Saved ${name}-${version} -> ${destination}`)
  }
}

async function downloadPackage(name, version) {
  const headers = {
    Authorization: `Bearer ${process.env.CA_TOKEN}`,
  }

  let response = await fetch(
    `${REGISTRY}/${encodeURIComponent(name)}/${version}`,
    {
      headers,
    }
  )

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `${response.status} ${response.statusText} — ${url}\n${body}`
    )
  }

  const tarballUrl = (await response.json()).dist?.tarball

  if (!tarballUrl) {
    throw new Error(`No dist.tarball for ${name}@${version}`)
  }

  response = await fetch(tarballUrl, {
    headers,
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} — ${tarballUrl}`)
  }

  return Buffer.from(await response.arrayBuffer())
}

main(VENDORS)
