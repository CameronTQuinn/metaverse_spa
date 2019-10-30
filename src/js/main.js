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
  </style>
  <div id="mydiv${i}">
    <div id="mydivheader${i}">
      <button type="button" class="closebutton" id="closebutton${i}">X</button>
    </div>
  </div>
  `
  // Event listener for dragging the element
  div.addEventListener('mousedown', function (event) {
    if (event.target === document.getElementById(`mydivheader${i}`)) {
      dragElement(document.getElementById(`mydiv${i}`), event)
    }
  })
  // Append the div to the window
  const appendTo = document.getElementById('windowarea')
  appendTo.appendChild(div)
  // Event listener for close button for each new "mini-window"
  const closeButton = document.getElementById(`closebutton${i}`)
  closeButton.addEventListener('click', () => {
    div.remove()
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
    console.log('Created instaChat with focus. zValue: ' + div.style.zIndex)
    // Give focus on click and highest z-value
    instaChat.addEventListener('click', (event) => {
      div.style.zIndex = `${zVal + 1}`
      div.focus()
      console.log('Clicked on instaChat gave focus. zValue: ' + div.style.zIndex)
      document.activeElement()
    })
    // If focus is no longer on insta-chat, it should not be the highest z-value
    window.addEventListener('click', (event) => {
      if (event.target !== instaChat) {
        div.style.zIndex = '0'
        console.log('Out of instaChat. zValue of parent div: ' + div.style.zIndex)
      }
    })
    // Append insta-chat element and initialize instance of the class
    appendAt.appendChild(instaChat)
    instaChat.initializeChat()
  } else if (typeVal === 2) {
    // Create a memory-game element
    type = 'memory-game'
    const memoryGame = document.createElement(`${type}`)
    memoryGame.setAttribute('id', `window${i}${type}`)
    div.style.zIndex = `${zVal + 1}`
    console.log('Created memoryGame with focus. zValue: ' + div.style.zIndex)
    // Give focus on click and highest z-value
    memoryGame.addEventListener('click', (event) => {
      div.style.zIndex = `${zVal + 1}`
      event.target.focus()
      console.log('Clicked on memoryGame gave focus. zValue: ' + div.style.zIndex)
    })
    // Focus leaves memoryGame
    window.addEventListener('click', (event) => {
      if (event.target !== memoryGame) {
        div.style.zIndex = '0'
        console.log('Out of memoryGame. zValue of parent div: ' + div.style.zIndex)
      }
    })
    appendAt.appendChild(memoryGame)
    memoryGame.createBoard(2, 2)
  } else if (typeVal === 3) {
    // Create clickGame element
    type = 'click-game'
    const clickGame = document.createElement(`${type}`)
    clickGame.setAttribute('id', `window${i}${type}`)
    appendAt.style.zIndex = `${zVal + 1}`
    console.log('Created clickGame with focus. zValue: ' + div.style.zIndex)
    // Give focus and highest z-value
    clickGame.addEventListener('click', (event) => {
      div.style.zIndex = `${zVal + 1}`
      div.focus()
      console.log('Clicked on clickGame gave focus. zValue: ' + div.style.zIndex)
    })
    // Focus leaves clickGame
    window.addEventListener('click', (event) => {
      if (event.target !== clickGame) {
        div.style.zIndex = '0'
        console.log('Out of clickGame. zValue of parent div: ' + div.style.zIndex)
      }
    })
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
