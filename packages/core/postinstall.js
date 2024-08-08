if (__dirname.includes('node_modules') || __dirname.includes('.faststore')) {
  process.exitCode = 1
}
