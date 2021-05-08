/**
 * Webpack config for production electron main process
 */

import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import baseConfig from './webpack.config.base';
import CheckNodeEnv from '../scripts/CheckNodeEnv';
import DeleteSourceMaps from '../scripts/DeleteSourceMaps';

CheckNodeEnv('production');
DeleteSourceMaps();

const devtoolsConfig = process.env.DEBUG_PROD === 'true' ? {
  devtool: 'source-map'
} : {};

export default merge(baseConfig, {
  ...devtoolsConfig,

  mode: 'production',

  target: 'electron-main',

  entry: './src/main.dev.ts',

  output: {
    path: path.join(__dirname, '../../'),
    filename: './src/main.prod.js',
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ]
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode:
        process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true',
    }),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false,
      FIREBASE_API_KEY:'AIzaSyDpAXwPV5VgSnuwR-GrHl4HYW74Oh18AxY',
      FIREBASE_AUTH_DOMAIN:'dark-garden-296622.firebaseapp.com',
      FIREBASE_PROJECT_ID:'dark-garden-296622',
      FIREBASE_STORAGE_BUCKET:'dark-garden-296622.appspot.com',
      FIREBASE_MESSAGING_SENDER_ID:'595121695085',
      FIREBASE_APP_ID:'1:595121695085:web:f34e64b4fc269bca0c9264',
    }),
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false,
  },
});
