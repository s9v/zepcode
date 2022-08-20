import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

export default {
  entry: 'dist/main.js',
  dest: 'dist/main-noimport.js',
  plugins: [
    babel(babelrc())
  ]
};
