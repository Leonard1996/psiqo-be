const source = new EventSource("http://localhost:4000/sessions/new/3")
source.onopen = e => console.log('on open', e)
source.onmessage = e => {
  console.log(e)
  const message = document.querySelector(".event-list")
  message.innerHTML = "Message received"
}



