// Template for insta-chat element
const template = document.createElement('template')
template.innerHTML = `
<style>
.insta-chat {
    padding: 2px; 
    height: 100%; 
    width: 100%; 
    resize: both; 
    overflow: scroll;
    border-style: solid; 
    border-color: blue; 
    color: white; 
    background-color: black; 
    text-align: left;  
  }

  .fixed-ratio-resize { /* basic responsive img */
    max-width: 10%;
    height: auto;
    width: auto\9; /* IE8 */
  }

  label {
      color: blue; 
      font-size: 25px; 
  }
  input {
      background-color: black; 
      color: white; 
  }
  button {
      font-family: 'marske';
      background-color: fuchsia; 
      color: blue; 
  }
  textarea {
      background-color: black;
      color: white;
  }
</style>
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
        <template>
            <p class="text" id='text'></p>
            <p class="author" id='author'></p>
        </template>
  </div>
  <br>
  <div class ="sendmessagearea" id="sendmessagearea">
    <p class="user" id = "user"></p>
    <textarea class="messagearea" id="messagearea"></textarea>
  </div>
</div>
`
class InstaChat extends window.HTMLElement {
  /**
   * Constructs an instance of the insta-chat custom element
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.parentDiv = this.shadowRoot.getElementById('insta-chat')
    this.parentDiv.addEventListener('click', (event) => {
      event.target.focus()
    })
    this.appendAt = this.shadowRoot.getElementById('messages')
    this.breakline = document.createElement('br')
    this.socket = null
  }

  /**
   * Initializes the chat by prompting the user for a username and saves that to local
   * storage, allowing the user to reset the username if desired.
   * Calls sendMessage() method if the username is valid, allowing the
   * user to send a message.
   */
  initializeChat () {
    // Get username
    let username = ''
    const userNameLabel = document.createElement('label')
    userNameLabel.innerHTML = 'Enter a username...'
    const userNameInput = document.createElement('input')
    // If a username is already in localStorage, make that the default username
    if (localStorage.getItem('username') !== null) {
      username = localStorage.getItem('username')
      userNameInput.value = username
    }
    const submitUsername = document.createElement('button')
    submitUsername.innerHTML = 'Submit'
    submitUsername.addEventListener('click', () => {
      const user = this.shadowRoot.getElementById('user')
      username = userNameInput.value.trim()
      // If the username received is valid, let them send a message
      if (username !== '') {
        // Store username in localStorage
        localStorage.setItem('username', `${username}`)
        user.innerHTML = `User: ${username}`
        userNameLabel.remove()
        userNameInput.remove()
        submitUsername.remove()
        const sendButton = document.createElement('button')
        sendButton.innerHTML = 'Send message'
        sendButton.addEventListener('click', (event) => {
          // Send the message
          const modify = this.shadowRoot.getElementById('messagearea')
          const value = modify.value
          this.connectToChat().then(function (socket) {
            console.log('In here')
            this.sendMessage(value, username)
          }.bind(this))
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
        this.appendAt.appendChild(errorMessage)
        const errorMessageButton = document.createElement('button')
        errorMessageButton.innerHTML = 'Okay'
        this.appendAt.appendChild(errorMessageButton)
        errorMessageButton.addEventListener('click', () => {
          errorMessage.remove()
          this.initializeChat()
        })
      }
    })
    this.appendAt.appendChild(this.breakline)
    this.appendAt.appendChild(userNameLabel).appendChild(userNameInput)
    this.appendAt.appendChild(submitUsername)
  }

  /**
   * The sendMessage method allows the user to send a message to the chat
   * @param {*} text - gets the text that they want to send
   * @param {*} username -gets the user's username
   */
  sendMessage (text, username) {
    // Data to send
    const data = {
      type: 'message',
      data: text,
      username: username,
      channel: 'my, not so secret, channel',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }
    // Connect to chat and send data
    this.connectToChat().then(function (socket) {
      socket.send(JSON.stringify(data))
    })
  }

  /**
   * Connect to chat
   */
  connectToChat () {
    return new Promise(function (resolve, reject) {
      if (this.socket && this.socket.readyState === 1) {
        resolve(this.socket)
        return
      }
      this.socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/')
      this.socket.addEventListener('open', () => {
        resolve(this.socket)
      })
      this.socket.addEventListener('message', function (event) {
        const message = JSON.parse(event.data)
        this.printMessage(message)
      }.bind(this))
      this.socket.addEventListener('error', function (event) {
        reject(new Error('The websocket you entered could not be completed as dialed'))
      })
    }.bind(this))
  }

  /**
   * Prints the messages as they are received from the chat
   * @param {*} message - message to print
   */
  printMessage (message) {
    console.log(message)
    const template = this.parentDiv.querySelectorAll('template')[0]
    console.log(template)
    const messageDiv = document.importNode(template.content, true)
    const text = messageDiv.getElementById('text')
    text.textContent = message.data
    const author = messageDiv.getElementById('author')
    author.textContent = message.username
    this.shadowRoot.getElementById('messages').appendChild(messageDiv)
  }
}
window.customElements.define('insta-chat', InstaChat)
export { InstaChat }
