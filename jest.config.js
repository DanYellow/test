export default {
    verbose: true,
    testMatch: ["**/tests/**/*.(spec|test).[jt]s?(x)"],
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$'],
    transform: {
        '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest',
    },
};
