import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

export default [
  // browser-friendly iife production build
  {
    entry: 'src/main.js',
    dest: pkg.browser,
    format: 'iife',
    moduleName: 'Modeste',
    sourceMap: true,
    plugins: [
      replace({
        MODESTE_ENV: JSON.stringify('production')
      }),
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      babel({
        exclude: ['node_modules/**']
      }),
      uglify()
    ]
  },

  // browser-friendly iife development build
  {
    entry: 'src/main.js',
    dest: pkg.browserDev,
    format: 'iife',
    moduleName: 'Modeste',
    sourceMap: true,
    plugins: [
      replace({
        MODESTE_ENV: JSON.stringify('development')
      }),
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      babel({
        exclude: ['node_modules/**']
      }),
      uglify()
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    entry: 'src/main.js',
    external: ['ms'],
    format: 'es',
    dest: pkg.module,
    plugins: [
      replace({
        MODESTE_ENV: JSON.stringify('development')
      })
    ]
  }
];
