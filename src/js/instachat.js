const template = document.createElement('template')
template.innerHTML = `
<div class="insta-chat" id="insta-chat">
  <h1 style="color:purple">
    InstaChat 
  </h1>
  <h3 style="color:blue">
    <i>
        The Next Generation of Chat Applications
    </i>
  </h3>
  <div class="messages" id="messages">
    <p class="text" id='text'></p>
    <p class="author" id='author'></p>
  </div>
  <textarea class="messagearea" id="messagearea"></textarea>
</div>
`
class InstaChat extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.parentDiv = this.shadowRoot.getElementById('insta-chat')
    this.breakline = document.createElement('br')
    this.socket = null
  }

  initializeChat () {
    // Get username
    let username = ''
    const userNameLabel = document.createElement('label')
    userNameLabel.innerHTML = 'Enter a username...'
    const userNameInput = document.createElement('input')
    const submitUsername = document.createElement('button')
    submitUsername.innerHTML = 'Submit'
    submitUsername.addEventListener('click', () => {
      const author = this.shadowRoot.getElementById('author')
      username = userNameInput.value.trim()
      // If the username received is valid, let them send a message
      if (username !== '') {
        author.innerHTML = `User: ${username}`
        userNameLabel.remove()
        userNameInput.remove()
        submitUsername.remove()
        const sendButton = document.createElement('button')
        sendButton.innerHTML = 'Send message'
        sendButton.addEventListener('click', (event) => {
          // Send the message
          const modify = this.shadowRoot.getElementById('messagearea')
          this.sendMessage(modify.value, username)
          // Empty the text area
          modify.value = ''
          event.preventDefault()
        })
        this.parentDiv.appendChild(sendButton)
      } else {
        // Display that username is invalid and allow for re-entry
        userNameLabel.remove()
        userNameInput.remove()
        submitUsername.remove()
        const errorMessage = document.createElement('h2')
        errorMessage.setAttribute('style', 'color:red')
        errorMessage.innerHTML = 'Invalid username, please re-enter a valid username'
        this.parentDiv.appendChild(errorMessage)
        const errorMessageButton = document.createElement('button')
        errorMessageButton.innerHTML = 'Okay'
        this.parentDiv.appendChild(errorMessageButton)
        errorMessageButton.addEventListener('click', () => {
          errorMessage.remove()
          this.initializeChat()
        })
      }
    })
    this.parentDiv.appendChild(this.breakline)
    this.parentDiv.appendChild(userNameLabel).appendChild(userNameInput)
    this.parentDiv.appendChild(submitUsername)
  }

  sendMessage (text, username) {
    const data = {
      type: 'message',
      data: text,
      username: username
    }
    console.log(text)
    console.log(username)
  }

  connectToChat () {
    this.socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/')
  }
}
window.customElements.define('insta-chat', InstaChat)
export { InstaChat }
