module.exports = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
  setupFiles: ['./test/setup.ts'],
  testEnvironment: 'jsdom',
}
