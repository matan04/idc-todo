var utils = require('./utils')

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: false,
    extract: false
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
