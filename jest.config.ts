module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: 'coverage',
    coverageReporters: ['html-spa'],
    // coverageThreshold: {
    //     global: {
    //         branches: 80,
    //         functions: 80,
    //         lines: 80,
    //         statements: 80,
    //     },
    // },
}