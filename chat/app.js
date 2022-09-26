require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const socketIO = require('socket.io')
const http = require('http')
const jwt = require('jsonwebtoken')
const redis = require('redis')


const app = express()
app.use(bodyParser.json())
app.use(cors())

const client = redis.createClient()

client.on('error', (err) => console.log('Redis Client Error', err));
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
   
    socket.on('requestHistory', async function (receiver){
      const [result, error] = verifyJwtToken(token)
      if (error) return

      const room = result.role === 'patient' ? `${result.id}-${receiver}` : `${receiver}-${result.id}`

      const existingChat = await client.hGetAll(room)
      console.log({existingChat})
      for (const value in existingChat) {
        existingChat[value] = JSON.parse(existingChat[value])
      }
    
      io.sockets.in(room).emit('loadHistory', existingChat)
    })

    socket.on('create', async function (room) {
      const [result, error] = verifyJwtToken(token)
      console.log("in create")
      if (error) return
      if (!room.split('').includes(result.id.toString())) return
      socket.join(room)

      io.sockets.in(room).emit('roomCreated')

      socket.on('createMessage', async function (message) {
        const [result, error] = verifyJwtToken(token)
        console.log("in create message")
        if (error) return
         console.log("here")
        const date = Date.now()
        message = {...message, date }
        console.log({message})

        io.sockets.in(room).emit('newMessage', message)

        client.hSet(room, date, JSON.stringify(message))
        client.hSet(room, 'latest', JSON.stringify(message))
      })

      socket.on('seen', async function(message){
        const [result, error] = verifyJwtToken(token)
        if (error) return
       
        // const room = result.role === 'patient' ? `${result.id}-${message.seen.receiver}` : `${message.seen.receiver}-${result.id}`

        io.sockets.in(room).emit('notifySeen', message)
        client.hSet(room, message.date, JSON.stringify(message))
        client.hSet(room, 'latest', JSON.stringify(message))
  
      })

      socket.on('typing', async function(message){
        const [result, error] = verifyJwtToken(token)
        if (error) return
       
        // const room = result.role === 'patient' ? `${result.id}-${message.receiver}` : `${message.receiver}-${result.id}`
        io.sockets.in(room).emit('showTyping', {isTyping: result.id})
  
      })

      socket.on('stopTyping', async function(message){
        const [result, error] = verifyJwtToken(token)
        if (error) return
     
       
        // const room = result.role === 'patient' ? `${result.id}-${message.receiver}` : `${message.receiver}-${result.id}`

        io.sockets.in(room).emit('unshowTyping', {isTyping: result.id})
  
      })

  
    })

  

    socket.on('disconnect', () => {
      console.log('disconnected from user')
    })
  })

  const PORT = process.env.PORT || 4999

  server.listen(PORT, () => {
    console.log(`Chat server listening on port ${PORT} at ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`)
  })

  app.get("/history", async (request, response ) => {
   response.send(await client.hGet(request.query.room, 'latest')) 
  })

  app.get("/test", async (request, response ) => {
    await client.set('test', 'it works');
    response.send(await client.get('test')) 
   })

  function verifyJwtToken(token) {
    try {
      const decoded = jwt.verify(token, '!secret@P_siqo2022$')
      return [decoded, null]
    } catch (err) {
      console.log({ err })
      return [null, err]
    }
  }

})()
