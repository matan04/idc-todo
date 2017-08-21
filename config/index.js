var path = require('path');

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  port: 8080,
  autoOpenBrowser: true,
  assetsRoot: path.resolve(__dirname, '../dist'),
  assetsSubDirectory: 'static',
  assetsPublicPath: '/',
  cssSourceMap: false
};
