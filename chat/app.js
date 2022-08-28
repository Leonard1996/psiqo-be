require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const socketIO = require('socket.io')
const http = require('http')
const jwt = require('jsonwebtoken')
const redis = require('redis')
const { parse } = require('path')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const client = redis.createClient()
let existingChat = '{}';
// client.on('error', (err) => console.log('Redis Client Error', err))
(async function startServer() {
  await client.connect()

  // await client.set('key', 'value');
  // const value = await client.get('key');

  let server = http.createServer(app)
  let io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })


  io.on('connection', (socket) => {
    console.log('New user connected')
    const token = socket.handshake.headers.authorization
    const [result, error] = verifyJwtToken(token)
    if (error) return
   

    socket.on('requestHistory', function (receiver){
      const room = result.role === 'patient' ? `${result.id}-${receiver}` : `${receiver}-${result.id}`

      io.sockets.in(room).emit('loadHistory', JSON.parse(existingChat))
    })

    socket.on('create', async function (room) {
      socket.join(room)

      existingChat = await client.get(room) || '{}'

      io.sockets.in(room).emit('roomCreated')

      socket.on('createMessage', async function (message) {
        const [result, error] = verifyJwtToken(token)
        if (error) return
      

        io.sockets.in(room).emit('newMessage', message)

        client.set(room, JSON.stringify({...JSON.parse(existingChat), [+new Date()]: message}))
      })
    })

    socket.on('disconnect', () => {
      console.log('disconnected from user')
    })
  })

  const PORT = process.env.PORT || 4999

  server.listen(PORT, () => {
    console.log(`Chat server listening on port ${PORT}`)
  })

  function verifyJwtToken(token) {
    try {
      const decoded = jwt.verify(token, 'secret')
      return [decoded, null]
    } catch (err) {
      console.log({ err })
      return [null, err]
    }
  }
})()
