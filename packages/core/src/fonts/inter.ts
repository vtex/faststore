// Babel-safe stub. When experimental.optimizedFonts is true, next.config.js
// redirects this import to src/fonts/inter.optimized.ts (via webpack's
// NormalModuleReplacementPlugin and Turbopack's resolveAlias), which
// side-effect-imports the @fontsource/inter CSS files and ships the
// self-hosted Inter .woff2 assets.
//
// When the flag is false (default), this empty module is what gets bundled,
// so no .woff2 files are added to the build and the store's behavior is
// unchanged.
