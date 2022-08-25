
const socket=io('http://localhost:4999',{
  extraHeaders: {
      Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJkb2NAZG9jLmNvbSIsInJvbGUiOiJkb2N0b3IiLCJpYXQiOjE2NjE0NTQ2NDgsImV4cCI6OTAwNzIwMDkxNjE5NTY0MH0.fyw_2QgrFPYZIETFGw8wr8GB3a40_CoCVky17A6nxi4'
    }
})



// connection with server
// room -> patient user id - doctor user id
socket.emit('create', '1-2');
socket.on('connect', function(){

});

// message listener from server
const messageList = document.querySelector('.messages')
socket.on('newMessage', function(message){
  console.log({message})
  messageList.innerHTML+='<div>' + message.value + '</div>'
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
