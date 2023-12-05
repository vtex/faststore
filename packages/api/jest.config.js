const config = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
}

export default config
