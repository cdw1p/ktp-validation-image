module.exports.initialize = function (app) {
  app.use('/api/recognition', require('./api/recognition'))
}