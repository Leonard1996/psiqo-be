
const socket=io('http://localhost:4999',{
    extraHeaders: {
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyMkB1c2VyLmNvbSIsInJvbGUiOiJwYXRpZW50IiwiaWF0IjoxNjYxMzU1NjQ1LCJleHAiOjkwMDcyMDA5MTYwOTY2MzZ9.-DGUmzx8YHcfmJIIc3V3sel9SxEcQwLKglmIrl1TXNM'
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
        receiver:2
      });
}
