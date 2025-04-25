module.exports = {
  ...require('../../jest.config.js'),
  testEnvironment: 'node',
  verbose: true,
  transform: {
    '\\.ts$': ['ts-jest'],
  },
  modulePathIgnorePatterns: [
    '<rootDir>/dist',
    'index.ts',
    'resolvers/',
    '__generated__',
    'typings/',
  ],
  testMatch: ['<rootDir>/test/unit/**/*.test.ts'],
  clearMocks: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx,js,jsx}'],
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
}
