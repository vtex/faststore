const readline = require('readline')
const { createReadStream } = require('fs')

async function main() {
  // ours is the intemerdiary PathHeadersMap structure, not the nginx conf file
  const ours = require('./path-headers-map')
  const theirs = await parseNetlifyHeaders()

  const ourPathToAccount = Object.keys(ours)
  for (const path in theirs) {
    if (!(path in ours)) {
      throw new Error(`${path} found in netlify headers is not present in ours`)
    }
    const idx = ourPathToAccount.indexOf(path)
    ourPathToAccount.splice(idx, 1)

    const theirHeaders = theirs[path]
    const ourHeaders = Array.from(ours[path])

    for (const hdr of theirHeaders) {
      const idx = ourHeaders.findIndex((h) => compareHeader(h, hdr))

      if (idx === -1) {
        throw new Error(
          `netlify header ${hdr.name} ${
            hdr.value
          } at path ${path} not found in our headers\n${stringifyHeaders(
            ours[path]
          )}`
        )
      }

      ourHeaders.splice(idx, 1)
    }

    if (ourHeaders.length > 0) {
      throw new Error(
        'we have headers that are not present in netlify for path ' +
          path +
          '\n' +
          stringifyHeaders(ourHeaders)
      )
    }
  }

  if (ourPathToAccount.length > 0) {
    throw new Error(
      "paths in ours headers not found in netlify's:\n" +
        ourPathToAccount.map((t) => '  ' + t).join('\n')
    )
  }

  console.log('all paths and headers match!')
}

main()

function stringifyHeaders(hdrs) {
  return hdrs.map((h) => `  ${h.name}: ${h.value}`).join('\n')
}

function compareHeader(h1, h2) {
  return h1.name === h2.name && h1.value === h2.value
}

function parseNetlifyHeaders(file = './_headers') {
  return new Promise((resolve) => {
    const rl = readline.createInterface(createReadStream(file))

    const headersMap = {}

    let activePath
    rl.on('line', (line) => {
      if (line.startsWith('/')) {
        activePath = normalizePath(line.trim())
        headersMap[activePath] = []
      } else if (line.startsWith(' ')) {
        // if (activePath === '/preview')
        headersMap[activePath].push(headerFromString(line.trim()))
      }
    })

    rl.on('close', () => {
      resolve(headersMap)
    })
  })
}

function normalizePath(path) {
  if (!path.endsWith('/') || path === '/') {
    return path
  }
  return path.slice(0, -1)
}

function headerFromString(header) {
  const [name, ...rest] = header.split(':')
  return {
    name,
    value: rest.join('').trim(),
  }
}
