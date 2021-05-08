/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import { dependencies as externals } from '../../src/package.json';

export default {
  externals: [...Object.keys(externals || {})],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },

  output: {
    path: path.join(__dirname, '../../src'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [path.join(__dirname, '../src'), 'node_modules'],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      FIREBASE_API_KEY:'AIzaSyDpAXwPV5VgSnuwR-GrHl4HYW74Oh18AxY',
      FIREBASE_AUTH_DOMAIN:'dark-garden-296622.firebaseapp.com',
      FIREBASE_PROJECT_ID:'dark-garden-296622',
      FIREBASE_STORAGE_BUCKET:'dark-garden-296622.appspot.com',
      FIREBASE_MESSAGING_SENDER_ID:'595121695085',
      FIREBASE_APP_ID:'1:595121695085:web:f34e64b4fc269bca0c9264',
    }),
  ],
};
