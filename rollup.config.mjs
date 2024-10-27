import eslint from '@rollup/plugin-eslint';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'lib/index.js',
            format: 'cjs',
        },
        {
            file: 'lib/index.esm.js',
            format: 'es',
        },
    ],
    plugins: [eslint()],
    external: ['lodash/debounce'],
};
