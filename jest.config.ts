/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageThreshold: {
    "global": {
      "branches": 85,
      "functions": 90,
      "lines": 90,
      "statements": -10
    }
  },
  preset: 'ts-jest',
  testEnvironment: "node",
};
