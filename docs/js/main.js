import './click-game.js'
import './memory-game.js'
import './instachat.js'
/**
 * Main sets event listeners for the different possible applications and calls
 * createWindow() with the corresponding value
 */

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
/**
 * Launches application, listens for events to close or drag the application
 * as well as for keeping the element with focus on top
 * @param {int} typeVal - which application we want to launch
 */

function createWindow (typeVal) {
  // Determine icon
  let icon
  if (typeVal === 1) {
    icon = 'fas fa-comment'
  } else if (typeVal === 2) {
    icon = 'fas fa-brain'
  } else if (typeVal === 3) {
    icon = 'fas fa-mouse-pointer'
  }
  // To keep track of which element to put in front
  const zVal = 0
  // Create a new element and use a template to fill in the details
  const div = document.createElement('div')
  // Keep track of which element this will be
  let i = 0
  while (document.getElementById(`window${i}`)) {
    i++
  }
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
  
  .icon {
    margin: 0px;
    position: absolute;
    top: 0px; 
    left: 0px;
    height: auto;
    width: auto; 
  }

  .icon:hover {
    background-color: white; 
    color: red;
  }
  </style>
  <div id="mydiv${i}">
    <div id="mydivheader${i}">
      <button class="icon" id="icon${i}"><i class="${icon}" style="font-size:15px"></i></button>
    </div>
  </div>
  `
  // Event listener for dragging the element
  div.addEventListener('mousedown', function (event) {
    if (event.target === document.getElementById(`mydivheader${i}`)) {
      dragElement(document.getElementById(`mydiv${i}`), event)
    }
  })
  // See if window should lose focus
  window.addEventListener('click', (event) => {
    if (!div.contains(event.target)) {
      div.style.zIndex = '0'
      div.blur()
      event.target.focus()
    } else {
      div.focus()
      div.style.zIndex = '1'
    }
  })
  // Append the div to the window
  const appendTo = document.getElementById('windowarea')
  appendTo.appendChild(div)
  // Event listener for close button for each new "mini-window"
  const closeButton = document.getElementById(`icon${i}`)
  closeButton.addEventListener('click', () => {
    div.remove()
    div.blur()
  })
  // Get the div
  const appendAt = document.getElementById(`mydiv${i}`)
  let type
  if (typeVal === 1) {
    // If type is inta-chat, create a insta-chat element
    type = 'insta-chat'
    const instaChat = document.createElement(`${type}`)
    instaChat.setAttribute('id', `window${i}${type}`)
    div.style.zIndex = `${zVal + 1}`
    appendAt.appendChild(instaChat)
    instaChat.initializeChat()
  } else if (typeVal === 2) {
    // Create a memory-game element
    type = 'memory-game'
    const memoryGame = document.createElement(`${type}`)
    memoryGame.setAttribute('id', `window${i}${type}`)
    div.style.zIndex = `${zVal + 1}`
    appendAt.appendChild(memoryGame)
    memoryGame.createBoard(2, 2)
  } else if (typeVal === 3) {
    // Create clickGame element
    type = 'click-game'
    const clickGame = document.createElement(`${type}`)
    clickGame.setAttribute('id', `window${i}${type}`)
    appendAt.style.zIndex = `${zVal + 1}`
    appendAt.appendChild(clickGame)
    clickGame.createGame()
  }
}

/**
 * Takes the mydiv element and the event and drags the element to where the user
 * releases the mouse
 * @param {*} element - sends in the mydiv corresponding to this event
 * @param {*} event - sends in the event
 */
function dragElement (element, event) {
  var pos1 = 0; var pos2 = 0; var pos3 = 0; var pos4 = 0
  element.onmousedown = dragMouseDown(event)

  function dragMouseDown (event) {
    event.preventDefault()
    // get the mouse cursor position at startup:
    pos3 = event.clientX
    pos4 = event.clientY
    document.onmouseup = closeDragElement
    // Call a function whenever the cursor moves:
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
