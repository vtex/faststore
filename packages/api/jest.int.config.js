module.exports = {
  ...require('../../jest.config.js'),
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  testMatch: ['<rootDir>/test/integration/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
  fakeTimers: { enableGlobally: true },
}
