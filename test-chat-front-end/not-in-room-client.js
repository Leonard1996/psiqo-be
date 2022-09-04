
const socket=io('http://localhost:4999',{
  extraHeaders: {
      Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJkb2NAZG9jLmNvbSIsInJvbGUiOiJkb2N0b3IiLCJpYXQiOjE2NjE0NTQ2NDgsImV4cCI6OTAwNzIwMDkxNjE5NTY0MH0.fyw_2QgrFPYZIETFGw8wr8GB3a40_CoCVky17A6nxi4'
    }
})



// connection with server
// room -> patient user id - doctor user id
socket.emit('create', '1-2');

socket.on('roomCreated', ()=>{
  socket.emit('requestHistory', 1)
})
const messageList = document.querySelector('.messages')
let messagesData = []

socket.on('loadHistory', function(messages){
  messageList.innerHTML = ''
  messagesData = []

  const messagesArray = Object.values(messages)
  messagesArray.sort((firstMessage, secondMessage)=>firstMessage.date - secondMessage.date)
  messagesArray.forEach(message => {
    messageList.innerHTML+=`<div>` + message.value + ` ${message.seen && message.receiver === 1 ? 'SEEN' : ''}`+ '</div>'
    messagesData.push(message)
  })
});

// message listener from server

socket.on('newMessage', function(message){
  messagesData.push(message)
  messageList.innerHTML+=`<div>` + message.value + '</div>'
});

// emits message from user side

// when disconnected from server
socket.on('disconnect', function(){
console.log('Disconnect from server')
});
//// --- test
function send(){
  const message = document.querySelector('input')
  socket.emit('createMessage', {
      value:message.value,
      receiver:1
    });
}
// id of this user = 2
const button = document.querySelector('input')

button.addEventListener(
  'focus',
  function (event) {
    for (let i=messagesData.length -1 ; i>=0;i--){
      if (messagesData[i].receiver === 2){

        if (!messagesData[i].seen) {
          socket.emit('seen', {...messagesData[i], seen:{receiver:1}, date:messagesData[i].date})
        }

        break;
      }
    }
  },
  false,
)


socket.on('notifySeen', function(message){

  let seenMessageIndex
  if (message.seen.receiver !== 2) return
  messagesData.forEach((md, index) =>{
    if (md.date === message.date) seenMessageIndex = index
  })

  messageList.innerHTML = ''
  console.log({messageList, messagesData})
  messagesData.forEach((message, index) => {
    if (message.date <= messagesData[seenMessageIndex].date && message.receiver !==2) {
      messageList.innerHTML +=`<div>` + message.value +" SEEN" +'</div>'
    }  else {
      messageList.innerHTML +=`<div>` + message.value +'</div>'
    }
  })
})

function startTyping(){
  socket.emit('typing',{
    receiver:1
  });
}

function stopTyping(){
  socket.emit('stopTyping',{
    receiver:1
  });
}

socket.on('showTyping', function(data){
  console.log({data})
  if (data.isTyping !== 2) {
    button.placeholder = 'typing...'
  }
})

socket.on('unshowTyping', function(data){
  if (data.isTyping !== 2) {
      button.placeholder = ''
  }
})
