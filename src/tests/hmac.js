/* eslint-disable no-console */
'use strict'
const http = require('http')
const crypto = require('node:crypto')

const secretKey = 'hmac'
function handleRequest(req, res) {
  const { url, method } = req
  // get the received HMAC from the request headers
  const hmacClient = req.headers['x-hmac-sign']
  console.log('🚀 ~ handleRequest ~ hmacClient:', { hmacClient })
  let body = ''
  req.on('data', (chunk) => {
    body += chunk
  })
  req.on('end', () => {
    const hmacServer = crypto
      .createHmac('sha256', secretKey)
      .update(body)
      .digest('hex')
    console.log('🚀 ~ req.on ~ hmacServer:', { hmacServer })

    if (hmacClient !== hmacServer) {
      res.writeHead(403, { contentType: 'text/plain' })
      return res.end('Invalid HMAC')
    }
    res.end('Hello!')
  })
}

const server = http.createServer(handleRequest)

server.listen(process.env.PORT || 3003, () => {
  console.log('Server listening on port 3003')
})
