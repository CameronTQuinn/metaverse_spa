const template = document.createElement('template')
template.innerHTML = `
<div class="insta-chat" id="insta-chat">
  <div class="messages" id="messages">
    <p class="text"></p>
    <p class="author"></p>
  </div>
  <textarea class="messageArea"></textarea>
</div>
`
class InstaChat extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.parentDiv = this.shadowRoot.getElementById('insta-chat')
    this.parentDiv.addEventListener('keypress', function (event) {
      // On the press of the enter key send a message
      if (event.keyCode === 13) {
        // Send a message
        // Empty textArea
        event.preventDefault()
      }
    })
    // Stuff
  }
}
window.customElements.define('insta-chat', InstaChat)
export { InstaChat }
