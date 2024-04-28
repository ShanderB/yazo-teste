module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts', '!src/main.ts', '!**/*Routes.ts'],
    coverageDirectory: 'coverage',
    coverageReporters: ['html-spa'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
}