const http = require('http')
const https = require('https')

module.exports = function createServer(router, opts) {
  const handler = serverHandler(router)

  var server = opts.ssl
    ? https.createServer(opts.ssl, handler)
    : http.createServer(handler)

  server.listen(opts.port, opts.host)
  return server
}

function serverHandler(router) {
  return function (req, res) {
    res.setHeader('Server', 'toxy (admin)')

    router(req, res, function (err) {
      if (err) {
        console.error(err.stack || err)
        res.writeHead(+err.status || 500, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ error: err.message || err }))
      }

      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end('{"error": "Not found"}')
    })
  }
}
