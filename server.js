const fs = require('fs');
const http = require('http')
const static = require('node-static')
const file = new (static.Server)(__dirname)

http.createServer(function (req, res) {
  file.serve(req, res)
}).listen(8080)