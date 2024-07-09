const fs = require('node:fs')
const args = process.argv

const copyGenerated = function (from, to) {
  try {
    fs.cpSync(from, to, { recursive: true, force: true })

    return { success: true }
  } catch (err) {
    console.error(
      `An error occurred while copying the generated files:\n  ${err.message}`
    )

    return { success: false }
  }
}

module.exports = { copyGenerated }

if (require.main?.filename === __filename) {
  if (args.length < 4) {
    console.error(`Expected 2 arguments and received: ${args.length - 2}`)
    process.exit(1)
  }

  const { success } = copyGenerated(args[2], args[3])

  success ? process.exit(0) : process.exit(1)
}
