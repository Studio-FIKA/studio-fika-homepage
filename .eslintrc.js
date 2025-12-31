module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    ignorePatterns: ['public/', 'resources/', 'node_modules/'],
    extends: ['airbnb-base', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'no-await-in-loop': 'off',
        'no-plusplus': 'off',
        'no-console': 'off',
    },
};
