import './clickGame.js'
import './memory-game.js'
import './instachat.js'

let zVal = 0

function main () {
  // Set up a menu on the bottom with links to launch apps
  // Create divs to contain applications that has a close feature
  const instaChatButton = document.getElementById('instachat')
  instaChatButton.addEventListener('click', (event) => {
    createWindow(1)
  })
  const memoryGameButton = document.getElementById('memorygame')
  memoryGameButton.addEventListener('click', (event) => {
    createWindow(2)
  })
  const clickGameButton = document.getElementById('clickgame')
  clickGameButton.addEventListener('click', (event) => {
    createWindow(3)
  })
}

function createWindow (typeVal) {
  const div = document.createElement('div')
  let i = 0
  while (document.getElementById(`window${i}`)) {
    i++
  }
  zVal++
  console.log('Total zVal set at open' + zVal)
  div.setAttribute('id', `window${i}`)
  div.innerHTML = `
  <style>
  #mydiv${i} {
    position: absolute;
    resize: both; 
    overflow: scroll; 
    background-color: #f1f1f1;
    text-align: center;
    border: 1px solid #d3d3d3;
  }

  #mydivheader${i} {
    padding: 10px;
    /* cursor: move; */
    background-color: #2196F3;
    color: #fff;
  }
  </style>
  <div id="mydiv${i}">
    <div id="mydivheader${i}">
      <button type="button" class="closebutton" id="closebutton${i}">X</button>
    </div>
  </div>
  `
  div.addEventListener('mousedown', function (event) {
    if (event.target === document.getElementById(`mydivheader${i}`)) {
      dragElement(document.getElementById(`mydiv${i}`), event)
    }
  })
  const appendTo = document.getElementById('windowarea')
  appendTo.appendChild(div)
  // Event listener for close button for each new "mini-window"
  const closeButton = document.getElementById(`closebutton${i}`)
  closeButton.addEventListener('click', () => {
    div.remove()
  })
  const appendAt = document.getElementById(`mydiv${i}`)
  let type
  if (typeVal === 1) {
    type = 'insta-chat'
    const instaChat = document.createElement(`${type}`)
    instaChat.setAttribute('id', `window${i}${type}`)
    console.log(zVal)
    instaChat.style.zIndex = `${zVal}`
    instaChat.addEventListener('click', (event) => {
      console.log(zVal)
      instaChat.style.zIndex = `${zVal}`
      console.log('instaChat z-value' + instaChat.style.zIndex)
      event.target.focus()
    })
    instaChat.addEventListener('blur', () => {
      instaChat.style.zIndex = '0'
      console.log('instaChat loses focus')
    })
    appendAt.appendChild(instaChat)
    instaChat.initializeChat()
  } else if (typeVal === 2) {
    type = 'memory-game'
    const memoryGame = document.createElement(`${type}`)
    memoryGame.setAttribute('id', `window${i}${type}`)
    console.log(zVal)
    memoryGame.style.zIndex = `${zVal}`
    memoryGame.addEventListener('click', (event) => {
      console.log(zVal)
      zVal++
      memoryGame.style.zIndex = `${zVal}`
      console.log('memoryGame z-value' + memoryGame.style.zIndex)
      event.target.focus()
    })
    memoryGame.addEventListener('blur', () => {
      memoryGame.style.zIndex = '0'
      console.log('memoryGame loses focus')
    })
    appendAt.appendChild(memoryGame)
    memoryGame.createBoard(2, 2)
  } else if (typeVal === 3) {
    type = 'click-game'
    const clickGame = document.createElement(`${type}`)
    clickGame.setAttribute('id', `window${i}${type}`)
    console.log(zVal)
    clickGame.style.zIndex = `${zVal}`
    clickGame.addEventListener('click', (event) => {
      console.log(zVal)
      zVal++
      clickGame.style.zIndex = `${zVal}`
      console.log('clickGame z-value' + clickGame.style.zIndex)
      console.log(clickGame.style.zIndex)
      event.target.focus()
    })
    clickGame.addEventListener('blur', () => {
      clickGame.style.zIndex = '0'
      console.log('clickGame loses focus')
    })
    appendAt.appendChild(clickGame)
    clickGame.createGame()
  }
}

// Make the DIV element draggagle:
function dragElement (element, event) {
  var pos1 = 0; var pos2 = 0; var pos3 = 0; var pos4 = 0
  element.onmousedown = dragMouseDown(event)

  function dragMouseDown (event) {
    event.preventDefault()
    // get the mouse cursor position at startup:
    pos3 = event.clientX
    pos4 = event.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  function elementDrag (event) {
    event.preventDefault()
    document.onmouseup = closeDragElement
    // New cursor position
    pos1 = pos3 - event.clientX
    pos2 = pos4 - event.clientY
    pos3 = event.clientX
    pos4 = event.clientY
    // Set new element position
    element.style.top = (element.offsetTop - pos2) + 'px'
    element.style.left = (element.offsetLeft - pos1) + 'px'
  }

  function closeDragElement () {
    // Stop when on mouseup
    document.onmouseup = null
    document.onmousemove = null
  }
}

export { main }
