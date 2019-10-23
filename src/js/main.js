function main () {
  const instaChat = document.createElement('insta-chat')
  const appendAt = document.querySelector('body')
  appendAt.appendChild(instaChat)
  instaChat.initializeChat()
}

export { main }
