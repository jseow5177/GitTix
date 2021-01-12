module.exports = {
  // Override webpack configuration
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300 // poll changes once every 300 ms
    return config
  }
}