const config = require('../config');
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.env.NODE_ENV)
}

const opn = require('opn');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('./webpack.conf');

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.port;

const app = express();

const compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
});

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
});

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' });
    cb();
  });
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
var staticPath = path.posix.join(config.assetsPublicPath, config.assetsSubDirectory);
app.use(staticPath, express.static('./static'));


var _resolve;
var readyPromise = new Promise(resolve => {
  _resolve = resolve
});

console.log('> Starting server...');
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at http://localhost:' + port + '\n');
  _resolve();
});

const server = app.listen(port);

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
};
