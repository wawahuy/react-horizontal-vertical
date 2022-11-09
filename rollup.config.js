const babel = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const postcss = require('rollup-plugin-postcss');
const terser  = require('@rollup/plugin-terser');
const replace = require('@rollup/plugin-replace');
const pkg = require('./package.json');

const isProduction = !process.env.IS_DEVELOPMENT;
const sourcemap = !isProduction;


module.exports = {
  input: 'src/index.tsx',
  watch: {
    include: 'src/**/*',
    exclude: 'node_modules/**/*',
    chokidar: {
      usePolling: true
    }
  },
  external: ['react', 'react-dom'],
  plugins: [
    replace({
      '__dev__': !isProduction,
      preventAssignment: true
    }),
    babel({
      babelHelpers: "runtime",
      exclude: "**/node_modules/**",
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    typescript({ sourceMap: sourcemap, tsconfig: './tsconfig.json' }),
    commonjs(),
    postcss({
      extract: true,
      modules: false,
      use: ['sass']
    }),
    isProduction && terser({ sourceMap: sourcemap })
  ],
  output: [
    {
      name: "react-horizontal-vertical",
      file: pkg.main,
      format: 'umd',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      sourcemap
    },
    { file: pkg.module, format: 'es', sourcemap }
  ]
};
