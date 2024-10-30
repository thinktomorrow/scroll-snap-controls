module.exports = {
    parserOptions: {
        ecmaVersion: 2020,
    },
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['airbnb-base', 'eslint:recommended'],
    rules: {
        indent: ['error', 4],
        'comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                functions: 'never',
            },
        ],
        'max-len': ['error', 120],
        'no-param-reassign': [2, { props: false }],
        'wrap-iife': 0,
        'func-names': 0,
        'no-plusplus': 0,
        'no-restricted-syntax': 0,
        'no-restricted-exports': 0,
        'no-underscore-dangle': 0,
        'object-curly-newline': 0,
        'import/no-extraneous-dependencies': 0,
        'global-require': 0,
        'no-new': 0,
        'default-param-last': 0,
        'no-console': ['warn', { allow: ['error'] }],
        'no-alert': 1,
        'operator-linebreak': 0,
    },
};
