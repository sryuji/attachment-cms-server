// https://jestjs.io/ja/docs/configuration
module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  rootDir: 'src',
  collectCoverage: false,
  collectCoverageFrom: [],
  testEnvironment: 'node',
  automock: false,
  setupFiles: ['../jest.setup.ts'],
}
