// Babel-safe stub. When experimental.optimizedFonts is true, next.config.js
// uses NormalModuleReplacementPlugin to swap this file for fonts/inter.ts
// (located outside src/), which side-effect-imports the @fontsource/inter
// CSS files and ships the self-hosted Inter .woff2 assets.
//
// When the flag is false (default), this empty module is what gets bundled,
// so no .woff2 files are added to the build and the store's behavior is
// unchanged.
export {}
