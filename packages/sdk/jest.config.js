module.exports = {
  ...require('../../jest.config.js'),
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
  setupFiles: ['./test/setup.ts'],
  testEnvironment: 'jsdom',
}
