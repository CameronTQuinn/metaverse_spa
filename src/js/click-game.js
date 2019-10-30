// Create a template for click-game custom element
const template = document.createElement('template')
template.innerHTML = `
<style>
.grid-container {
  display: grid; 
  grid-template-columns: auto auto; 
}
.click-game {
  padding: 2px; 
  height: 100%; 
  width: 100%; 
  resize: both; 
  overflow: scroll;
  border-style: solid; 
  border-color: blue; 
  text-align: left;  
}

.fixed-ratio-resize { /* basic responsive img */
  max-width: 10%;
  height: auto;
  width: auto\9; /* IE8 */
}

img {
  height: 10vw;
  width: 10vw; 
  float: left; 
  padding: 0 2%; 
}

.column-left{ 
  float: left; width: 200px; height: 150px
}
.column-right{ 
  float: left; width: 200px; height: 150px 
}
.column-center{ 
  display: inline-block; width: 200px; height: 150px 
}
.container {
    width: 610px;
}

.border {
    border: 1px solid black;
}

.grey {
    background-color: grey;
}
.red {
    background-color: red;
}
.blue {
    background-color: blue;
}
.yellow {
    background-color: yellow;
}
</style>

<div class="click-game" id ='click-game' style='background-color: black'>
  <div id="divheader"><h1 style="color:blue">Click Game<h1></div>
  <div class="messages">
    <h2>
        <div id="colorToClick">Color to click: </div>
        <div style="color:white" id="time">Time: </div>
    </h2>
  </div>
    <div class="container" id="board">
      <div class="column-center border grey" id="tile2"></div>
      <div class="column-left border grey" id="tile0"></div>
      <div class="column-right border grey" id="tile1"></div>
      <div class="column-center border grey" id="tile5"></div>
      <div class="column-left border grey" id="tile3"></div>
      <div class="column-right border grey" id="tile4"></div>
      <div class="column-center border grey" id="tile8"></div>
      <div class="column-left border grey" id="tile6"></div>
      <div class="column-right border grey" id="tile7"></div>
  </div>
  <div id = "endmessages">
  </div>
</div>
`
class ClickGame extends window.HTMLElement {
  /**
   * Creates an instance of the ClickGame custom element
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    // this.appendAt
    this.colorsEnum = Object.freeze({ blue: 0, red: 1, yellow: 2 })
    this.board = [{ color: '' }, { color: '' }, { color: '' }, { color: '' }, { color: '' }, { color: '' }, { color: '' }, { color: '' }, { color: '' }]
  }

  /**
   * Gets the clickColor randomly
   */
  getClickColor () {
    // List of colors
    var keys1 = Object.keys(this.colorsEnum)
    const clickColor = this.colorsEnum[keys1[Math.floor(keys1.length * Math.random())]]
    const clickColorLoc = this.shadowRoot.getElementById('colorToClick')
    // Sets the color label in the window
    clickColorLoc.setAttribute('style', `color:${keys1[clickColor]}`)
    clickColorLoc.innerHTML = `Color to Click: ${keys1[clickColor]}`
    return keys1[clickColor]
  }

  /**
   * Gets the color for each of the tiles
   */
  getColor () {
    let blueCount = 0
    let redCount = 0
    let yellowCount = 0
    const board = this.board
    // For each tile, gives it a color
    for (let i = 0; i < board.length; i++) {
      // Randomly gets a color from the list of colors
      var keys2 = Object.keys(this.colorsEnum)
      const newColorOfThree = this.colorsEnum[keys2[Math.floor(keys2.length * Math.random())]]
      // If color counts are not full
      if ((blueCount !== 3) && (redCount !== 3) && (yellowCount !== 3)) {
        // If the random color is blue and blue is not full
        if ((newColorOfThree === 0) && (blueCount !== 3)) {
        // Change tile attribute
          board[i].color = 'blue'
          blueCount++
        } else if (newColorOfThree === 1 && redCount !== 3) {
          // If color is red and red is not full
          board[i].color = 'red'
          redCount++
        } else if (newColorOfThree === 2 && yellowCount !== 3) {
          // If color is yellow and yellow is not full
          board[i].color = 'yellow'
          yellowCount++
        }
      } else if (((blueCount === 3) && (redCount === 3)) || ((blueCount === 3) && (yellowCount === 3)) || ((redCount === 3) && (yellowCount === 3))) {
        // If any two of the colors are full
        if ((blueCount === 3) && (redCount === 3)) {
          // If blue and red are full, the color must be yellow
          board[i].color = 'yellow'
          yellowCount++
        } else if ((blueCount === 3) && (yellowCount === 3)) {
          // If blue and yellow are full, the color must be red
          board[i].color = 'red'
          redCount++
        } else if ((redCount === 3) && (yellowCount === 3)) {
          // If red and yellow are full, the color must be blue
          board[i].color = 'blue'
          blueCount++
        } else {
          console.log('Something went wrong')
        }
      } else if ((blueCount === 3) || (redCount === 3) || (yellowCount === 3)) {
        // If one of the colors is full
        if (blueCount === 3) {
          // If blue is full, get color from other two possible colors
          const newKeys = keys2.filter(function (value) {
            return value !== 'blue'
          })
          // Get randomly from either red or yellow
          const newColorOfTwo = this.colorsEnum[newKeys[Math.floor((newKeys.length - 1) * Math.random())]]
          if (newColorOfTwo === 0) {
            // Color is red
            board[i].color = 'red'
            redCount++
          } else if (newColorOfTwo === 1) {
            // Color is yellow
            board[i].color = 'yellow'
            yellowCount++
          }
        } else if (redCount === 3) {
          // If red is full, get color from two other possible colors
          const newKeys = keys2.filter(function (value) {
            return value !== 'red'
          })
          // Random color between blue and yellow
          const newColorOfTwo = this.colorsEnum[newKeys[Math.floor((newKeys.length - 1) * Math.random())]]
          if (newColorOfTwo === 0) {
            // Color is blue
            board[i].color = 'blue'
            blueCount++
          } else if (newColorOfTwo === 1) {
            // Color is yellow
            board[i].color = 'yellow'
            yellowCount++
          }
        } else if (yellowCount === 3) {
          // If yellow is full, get color from two other possible colors
          keys2 = keys2.filter(function (value) {
            return value !== 'yellow'
          })
          // Random color between blue and red
          const newColorOfTwo = this.colorsEnum[keys2[Math.floor((keys2.length - 1) * Math.random())]]
          if (newColorOfTwo === 0) {
            // Color is blue
            board[i].color = 'blue'
            blueCount++
          } else if (newColorOfTwo === 1) {
            // Color is red
            board[i].color = 'red'
            redCount++
          }
        } else {
          console.log('Something went wrong')
        }
      }
    }
    return board
  }

  /**
   * Sets each of the tiles in the board to its random color from getColor
   * @param {*} board - manipulates the board
   */
  tileAssign (board) {
  // Assign tiles
    board = this.getColor(board)
    const c1r1 = this.shadowRoot.getElementById('tile0')
    c1r1.setAttribute('class', `column-left border ${board[0].color}`)
    const c2r1 = this.shadowRoot.getElementById('tile1')
    c2r1.setAttribute('class', `column-right border ${board[1].color}`)
    const c3r1 = this.shadowRoot.getElementById('tile2')
    c3r1.setAttribute('class', `column-center border ${board[2].color}`)
    const c1r2 = this.shadowRoot.getElementById('tile3')
    c1r2.setAttribute('class', `column-left border ${board[3].color}`)
    const c2r2 = this.shadowRoot.getElementById('tile4')
    c2r2.setAttribute('class', `column-right border ${board[4].color}`)
    const c3r2 = this.shadowRoot.getElementById('tile5')
    c3r2.setAttribute('class', `column-center border ${board[5].color}`)
    const c1r3 = this.shadowRoot.getElementById('tile6')
    c1r3.setAttribute('class', `column-left border ${board[6].color}`)
    const c2r3 = this.shadowRoot.getElementById('tile7')
    c2r3.setAttribute('class', `column-right border ${board[7].color}`)
    const c3r3 = this.shadowRoot.getElementById('tile8')
    c3r3.setAttribute('class', `column-center border ${board[8].color}`)
  }

  /**
   * Plays game, setting a timer and seeing if the user clicks all three
   * tiles of the desired color before the time runs out.
   * @param {*} clickColor - gets the color the user should click
   */
  game (clickColor) {
    // If color clicked is click color then turn it to grey
    // If player gets all three, WIN!
    // If player runs out of Time, LOSE!
    // Timer
    let count = 0
    let time = 20
    const timeDisplay = document.createElement('h2')
    const appendAt = this.shadowRoot.getElementById('time')
    timeDisplay.setAttribute('style', 'color:red')
    appendAt.appendChild(timeDisplay)
    const timer = setInterval(function () {
      if (time === 0) {
        clearInterval(timer)
        timeDisplay.remove()
        time = 20
        // Remove event listeners
        this.restartGame(false)
      } else {
        // Decrement and display time
        time--
        timeDisplay.innerHTML = `${time}`
      }
    }.bind(this), 1000)
    // For each tile, watch for a click and call onClick if clicked
    const c1r1 = this.shadowRoot.getElementById('tile0')
    c1r1.addEventListener('click', function (event) {
      count = this.onClick(event, count, clickColor, 'left')
      if (count === 3) {
        // If the count is three, remove the timer, event listeners, messages, and restart game
        count = 0
        timeDisplay.remove()
        clearInterval(timer)
        this.cleanUp()
        this.restartGame(true, time)
      }
    }.bind(this))
    const c2r1 = this.shadowRoot.getElementById('tile1')
    c2r1.addEventListener('click', function (event) {
      count = this.onClick(event, count, clickColor, 'right')
      if (count === 3) {
        // If the count is three, remove the timer, event listeners, messages, and restart game
        count = 0
        timeDisplay.remove()
        clearInterval(timer)
        this.cleanUp(c1r1, c2r1, c3r1, c1r2, c2r2, c3r2, c1r3, c2r3, c3r3)
        this.restartGame(true, time)
      }
    }.bind(this))
    const c3r1 = this.shadowRoot.getElementById('tile2')
    c3r1.addEventListener('click', function (event) {
      count = this.onClick(event, count, clickColor, 'center')
      if (count === 3) {
        // If the count is three, remove the timer, event listeners, messages, and restart game
        count = 0
        timeDisplay.remove()
        clearInterval(timer)
        this.cleanUp(c1r1, c2r1, c3r1, c1r2, c2r2, c3r2, c1r3, c2r3, c3r3)
        this.restartGame(true, time)
      }
    }.bind(this))
    const c1r2 = this.shadowRoot.getElementById('tile3')
    c1r2.addEventListener('click', function (event) {
      count = this.onClick(event, count, clickColor, 'left')
      if (count === 3) {
        // If the count is three, remove the timer, event listeners, messages, and restart game
        count = 0
        timeDisplay.remove()
        clearInterval(timer)
        this.cleanUp(c1r1, c2r1, c3r1, c1r2, c2r2, c3r2, c1r3, c2r3, c3r3)
        this.restartGame(true, time)
      }
    }.bind(this))
    const c2r2 = this.shadowRoot.getElementById('tile4')
    c2r2.addEventListener('click', function (event) {
      count = this.onClick(event, count, clickColor, 'right')
      if (count === 3) {
        // If the count is three, remove the timer, event listeners, messages, and restart game
        count = 0
        timeDisplay.remove()
        clearInterval(timer)
        this.cleanUp(c1r1, c2r1, c3r1, c1r2, c2r2, c3r2, c1r3, c2r3, c3r3)
        this.restartGame(true, time)
      }
    }.bind(this))
    const c3r2 = this.shadowRoot.getElementById('tile5')
    c3r2.addEventListener('click', function (event) {
      count = this.onClick(event, count, clickColor, 'center')
      if (count === 3) {
        // If the count is three, remove the timer, event listeners, messages, and restart game
        count = 0
        timeDisplay.remove()
        clearInterval(timer)
        this.cleanUp(c1r1, c2r1, c3r1, c1r2, c2r2, c3r2, c1r3, c2r3, c3r3)
        this.restartGame(true, time)
      }
    }.bind(this))
    const c1r3 = this.shadowRoot.getElementById('tile6')
    c1r3.addEventListener('click', function (event) {
      count = this.onClick(event, count, clickColor, 'left')
      if (count === 3) {
        // If the count is three, remove the timer, event listeners, messages, and restart game
        count = 0
        timeDisplay.remove()
        clearInterval(timer)
        this.cleanUp(c1r1, c2r1, c3r1, c1r2, c2r2, c3r2, c1r3, c2r3, c3r3)
        this.restartGame(true, time)
      }
    }.bind(this))
    const c2r3 = this.shadowRoot.getElementById('tile7')
    c2r3.addEventListener('click', function (event) {
      count = this.onClick(event, count, clickColor, 'right')
      if (count === 3) {
        // If the count is three, remove the timer, event listeners, messages, and restart game
        count = 0
        timeDisplay.remove()
        clearInterval(timer)
        this.cleanUp(c1r1, c2r1, c3r1, c1r2, c2r2, c3r2, c1r3, c2r3, c3r3)
        this.restartGame(true, time)
      }
    }.bind(this))
    const c3r3 = this.shadowRoot.getElementById('tile8')
    c3r3.addEventListener('click', function (event) {
      count = this.onClick(event, count, clickColor, 'center')
      if (count === 3) {
        // If the count is three, remove the timer, event listeners, messages, and restart game
        count = 0
        timeDisplay.remove()
        clearInterval(timer)
        this.cleanUp(c1r1, c2r1, c3r1, c1r2, c2r2, c3r2, c1r3, c2r3, c3r3)
        this.restartGame(true, time)
      }
    }.bind(this))
  }

  /**
   * Sees if tile clicked is of the correct color. If so, set to grey and increment count.
   * If three, the player has won!
   * @param {*} event - the event under which the eventListener was fired
   * @param {*} timer - timer in case we win
   * @param {*} time - time to display in case we win
   * @param {*} count - current count that the user has successfully selected
   * @param {*} clickColor - color to be clicked by user
   * @param {*} pos - position of the tile
   */
  onClick (event, count, clickColor, pos) {
    const tar = event.target
    const modify = this.shadowRoot.getElementById(`${tar.id}`)
    // If tile is the right color
    if (modify.getAttribute('class') === `column-${pos} border ${clickColor}`) {
      tar.setAttribute('class', `column-${pos} border grey`)
      count++
    }
    /* If the user has selected all three tiles of the correct color
    if (count === 3) {
      clearInterval(timer)
      // Restart the game
      this.restartGame(true, time)
    }
    */
    return count
  }

  /**
   * Takes each of the element and calls removeAllEventListenersFromElement
   * @param {*} c1r1 - First tile
   * @param {*} c2r1 - Second tile
   * @param {*} c3r1 - Third tile
   * @param {*} c1r2 - Fourth tile
   * @param {*} c2r2 - Fifth tile
   * @param {*} c3r2 - Sixth tile
   * @param {*} c1r3 - Seventh tile
   * @param {*} c2r3 - Eight tile
   * @param {*} c3r3 - Ninth tile
   */
  cleanUp (c1r1, c2r1, c3r1, c1r2, c2r2, c3r2, c1r3, c2r3, c3r3) {
    this.removeEventListeners(c1r1)
    this.removeEventListeners(c2r1)
    this.removeEventListeners(c3r1)
    this.removeEventListeners(c1r2)
    this.removeEventListeners(c2r2)
    this.removeEventListeners(c3r2)
    this.removeEventListeners(c1r3)
    this.removeEventListeners(c2r3)
    this.removeEventListeners(c3r3)
  }

  /**
   * Removes event listeners from a given element
   * @param {*} element - Element to remove the listeners from
   */
  removeEventListeners (element) {
    const clone = element.cloneNode()
    // Move all child elements from the original to the clone
    while (element.firstChild) {
      clone.appendChild(element.lastChild)
    }
    element.parentNode.replaceChild(clone, element)
  }

  /**
   * Restarts the game, displaying the appropriate message(s) to the user
   * @param {*} value - which kind of ending to the game, a win or timeout?
   * @param {*} time - time
   */
  restartGame (value, time) {
    // debugger
    const appendAt = this.shadowRoot.getElementById('endmessages')
    // If player won
    if (value === true) {
      while (appendAt.firstChild) {
        appendAt.removeChild(appendAt.firstChild)
      }
      const winLabel = document.createElement('h2')
      winLabel.innerHTML = 'You have won!'
      winLabel.setAttribute('style', 'color:purple')
      const winButton = document.createElement('button')
      winButton.innerHTML = 'Play again?'
      appendAt.appendChild(winLabel).appendChild(winButton)
      winButton.addEventListener('click', (event) => {
        // Get rid of the won messaging
        while (appendAt.firstChild) {
          appendAt.removeChild(appendAt.firstChild)
        }
        this.createGame()
      })
    } else if (value === false) {
    // Display that they have failed
      const failMessage = document.createElement('h2')
      failMessage.setAttribute('style', 'color:red')
      failMessage.innerHTML = 'You ran out of time!'
      const failButton = document.createElement('button')
      failButton.innerHTML = 'Play again?'
      failButton.addEventListener('click', (event) => {
        // If they have failed, allow them to restart game
        while (appendAt.firstChild) {
          // Remove messages
          appendAt.removeChild(appendAt.firstChild)
        }
        this.createGame()
      })
      appendAt.appendChild(failMessage).appendChild(failButton)
    }
  }

  /**
   * Method for creating the game by getting the click color, coloring the tiles,
   * and actually playing the game
   */
  createGame () {
    const clickColor = this.getClickColor()
    this.tileAssign()
    this.game(clickColor)
  }
}
window.customElements.define('click-game', ClickGame)
export { ClickGame }
