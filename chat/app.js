require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const socketIO = require('socket.io');
const http = require('http')
const jwt = require('jsonwebtoken');

var app = express()
app.use(bodyParser.json())
app.use(cors())


let server = http.createServer(app)
let io = socketIO(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })


// make connection with user from server side
io.on('connection', (socket)=>{
    console.log('New user connected');
    const token = socket.handshake.headers.authorization
    const [result, error] = verifyJwtToken(token)
    if (error) return;
   
    socket.on('create', function(room) {
      socket.join(room);
      socket.on('createMessage',function(message){
        const [result, error] = verifyJwtToken(token)
        if (error) return;
        console.log({result,message})
        const room = result.role ==='patient'?`${result.id}-${message.receiver}`:`${message.receiver}-${result.id}`

        io.sockets.in(room).emit('newMessage', message);
      })
     
    }); 
    // listen for message from user
    
   
    // when server disconnects from user
    socket.on('disconnect', ()=>{
      console.log('disconnected from user');
    });
  });
   
const PORT = process.env.PORT || 4999

server.listen(PORT, ()=>{
    console.log(`Chat server listening on port ${PORT}`)
});


function verifyJwtToken(token){
  try {
    const decoded = jwt.verify(token, 'secret');
    return [decoded, null]
  } catch (err){
    console.log({err})
    return [null, err]
  }
}