const template = document.createElement('template')
template.innerHTML = `


`
function main () {
  // Set up a menu on the bottom with links to launch apps
  // Create divs to contain applications that has a close feature
  const instaChatButton = document.getElementById('instachat')
  instaChatButton.addEventListener('click', (event) => {
    console.log('instaChat')
  })
  const memoryGameButton = document.getElementById('memorygame')
  memoryGameButton.addEventListener('click', (event) => {
    console.log('memoryGame')
  })
  const clickGameButton = document.getElementById('clickgame')
  clickGameButton.addEventListener('click', (event) => {
    console.log('clickGame')
  })
  /*
  const instaChat = document.createElement('insta-chat')
  const appendAt = document.querySelector('body')
  appendAt.appendChild(instaChat)
  instaChat.initializeChat()
  */
}

function createWindow() {


}

export { main }
