const path = require('path');
const RunChromeExtension = require('webpack-run-chrome-extension');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');

const IS_PROD = process.env.NODE_ENV === 'production';
const paths = {
  build: path.resolve(__dirname, 'dist'),
  src: path.resolve(__dirname, 'src'),
};

module.exports = {
  mode: IS_PROD ? 'production' : 'development',

  // Where webpack looks to start building the bundle
  entry: {
    content: `${paths.src}/js/content.js`,
    options: `${paths.src}/js/options.js`,
    background: `${paths.src}/js/background.js`,
  },

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: '[name].js',
  },

  // Customize the webpack build process
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        `${paths.src}/manifest.json`,
        { from: `${paths.src}/*.html`, context: paths.src },
        { from: `${paths.src}/_locales`, to: `${paths.build}/_locales` },
        { from: `${paths.src}/css`, to: `${paths.build}/css` },
        { from: `${paths.src}/images`, to: `${paths.build}/images` },
      ],
    }),
    IS_PROD &&
      new ZipWebpackPlugin({
        path: '../',
        filename: 'release.zip',
      }),
    !IS_PROD &&
      new RunChromeExtension({
        extensionPath: paths.build,
        startingUrl: 'https://youtube.com',
        autoReload: true,
      }),
  ].filter(Boolean),

  // Determine how modules within the project are treated
  module: {
    rules: [
      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

      // Fonts and SVGs: Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|svg)$/, type: 'asset/inline' },
    ],
  },

  resolve: {
    modules: ['src', 'node_modules'],
  },

  // Control how source maps are generated
  devtool: IS_PROD ? false : 'inline-source-map',

  watch: !IS_PROD,

  optimization: {
    minimize: IS_PROD,
  },
};
