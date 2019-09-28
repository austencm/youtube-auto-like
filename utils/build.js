var webpack = require("webpack");
var baseConfig = require("../webpack.config");
var merge = require('webpack-merge');
var FileManagerPlugin = require('filemanager-webpack-plugin');

delete baseConfig.chromeExtensionBoilerplate;

var config = merge(baseConfig, {
  plugins: [
    new FileManagerPlugin({
      onEnd: {
        archive: [
          { source: 'build', destination: 'build.zip' },
        ]
      }
    })
  ]
})

webpack(
  config,
  function (err) { if (err) throw err; }
);
