import './clickGame.js'
import './memory-game.js'
import './instachat.js'
function main () {
  // Set up a menu on the bottom with links to launch apps
  // Create divs to contain applications that has a close feature
  const instaChatButton = document.getElementById('instachat')
  instaChatButton.addEventListener('click', (event) => {
    console.log('instaChat')
    createWindow(1)
  })
  const memoryGameButton = document.getElementById('memorygame')
  memoryGameButton.addEventListener('click', (event) => {
    console.log('memoryGame')
    createWindow(2)
  })
  const clickGameButton = document.getElementById('clickgame')
  clickGameButton.addEventListener('click', (event) => {
    console.log('clickGame')
    createWindow(3)
  })
  /*
  const instaChat = document.createElement('insta-chat')
  const appendAt = document.querySelector('body')
  appendAt.appendChild(instaChat)
  instaChat.initializeChat()
  */
}

function createWindow (typeVal) {
  let type
  if (typeVal === 1) {
    type = 'instChat'
  } else if (typeVal === 2) {
    type = 'memoryGame'
  } else if (typeVal === 3) {
    type = 'clickGame'
  }
  const div = document.createElement('div')
  let i = 0
  while (document.getElementById(`window${i}`)) {
    i++
  }
  div.setAttribute('id', `window${i}`)
  div.innerHTML = `
  <style>
  #mydiv${i} {
    position: absolute;
    z-index: 9;
    background-color: #f1f1f1;
    text-align: center;
    border: 1px solid #d3d3d3;
  }

  #mydivheader${i} {
    padding: 10px;
    cursor: move;
    z-index: 10;
    background-color: #2196F3;
    color: #fff;
  }
  </style>
  <div id="mydiv${i}">
    <div id="mydivheader${i}">Click here to move</div>
    <p>Move</p>
    <p>this</p>
    <p>DIV</p>
  </div>
  `
  div.addEventListener('mousedown', function (event) {
    dragElement(document.getElementById(`mydiv${i}`))
  })
  const appendAt = document.getElementById('windowarea')
  appendAt.appendChild(div)
}

// Make the DIV element draggagle:

function dragElement (element) {
  var pos1 = 0; var pos2 = 0; var pos3 = 0; var pos4 = 0
  if (document.getElementById(element.id + 'header')) {
    /* if present, the header is where you move the DIV from: */
    document.getElementById(element.id + 'header').onmousedown = dragMouseDown
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV: */
    element.onmousedown = dragMouseDown
  }

  function dragMouseDown (e) {
    e = e || window.event
    e.preventDefault()
    // get the mouse cursor position at startup:
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  function elementDrag (e) {
    e = e || window.event
    e.preventDefault()
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // set the element's new position:
    element.style.top = (element.offsetTop - pos2) + 'px'
    element.style.left = (element.offsetLeft - pos1) + 'px'
  }

  function closeDragElement () {
    /* stop moving when mouse button is released: */
    document.onmouseup = null
    document.onmousemove = null
  }
}
export { main }
