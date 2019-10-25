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
</div>
`
class ClickGame extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    // this.appendAt
    this.colorsEnum = Object.freeze({ blue: 0, red: 1, yellow: 2 })
    this.board = [{ color: '' }, { color: '' }, { color: '' }, { color: '' }, { color: '' }, { color: '' }, { color: '' }, { color: '' }, { color: '' }]
  }

  getClickColor () {
  // Click color
    var keys1 = Object.keys(this.colorsEnum)
    const clickColor = this.colorsEnum[keys1[Math.floor(keys1.length * Math.random())]]
    const clickColorLoc = this.shadowRoot.getElementById('colorToClick')
    clickColorLoc.setAttribute('style', `color:${keys1[clickColor]}`)
    clickColorLoc.innerHTML = `Color to Click: ${keys1[clickColor]}`
    return keys1[clickColor]
  }

  getColor () {
    let blueCount = 0
    let redCount = 0
    let yellowCount = 0
    const board = this.board
    for (let i = 0; i < board.length; i++) {
      var keys2 = Object.keys(this.colorsEnum)
      const newColorOfThree = this.colorsEnum[keys2[Math.floor(keys2.length * Math.random())]]
      if ((blueCount !== 3) && (redCount !== 3) && (yellowCount !== 3)) {
        if ((newColorOfThree === 0) && (blueCount !== 3)) {
        // Change tile attribute
          board[i].color = 'blue'
          blueCount++
        } else if (newColorOfThree === 1 && redCount !== 3) {
          board[i].color = 'red'
          redCount++
        } else if (newColorOfThree === 2 && yellowCount !== 3) {
          board[i].color = 'yellow'
          yellowCount++
        }
      } else if (((blueCount === 3) && (redCount === 3)) || ((blueCount === 3) && (yellowCount === 3)) || ((redCount === 3) && (yellowCount === 3))) {
        if ((blueCount === 3) && (redCount === 3)) {
          board[i].color = 'yellow'
          yellowCount++
        } else if ((blueCount === 3) && (yellowCount === 3)) {
          board[i].color = 'red'
          redCount++
        } else if ((redCount === 3) && (yellowCount === 3)) {
          board[i].color = 'blue'
          blueCount++
        } else {
          console.log('Something went wrong')
        }
      } else if ((blueCount === 3) || (redCount === 3) || (yellowCount === 3)) {
        if (blueCount === 3) {
          const newKeys = keys2.filter(function (value) {
            return value !== 'blue'
          })
          const newColorOfTwo = this.colorsEnum[newKeys[Math.floor((newKeys.length - 1) * Math.random())]]
          if (newColorOfTwo === 0) {
            board[i].color = 'red'
            redCount++
          } else if (newColorOfTwo === 1) {
            board[i].color = 'yellow'
            yellowCount++
          }
        } else if (redCount === 3) {
          const newKeys = keys2.filter(function (value) {
            return value !== 'red'
          })
          const newColorOfTwo = this.colorsEnum[newKeys[Math.floor((newKeys.length - 1) * Math.random())]]
          if (newColorOfTwo === 0) {
            board[i].color = 'blue'
            blueCount++
          } else if (newColorOfTwo === 1) {
            board[i].color = 'yellow'
            yellowCount++
          }
        } else if (yellowCount === 3) {
          keys2 = keys2.filter(function (value) {
            return value !== 'yellow'
          })
          const newColorOfTwo = this.colorsEnum[keys2[Math.floor((keys2.length - 1) * Math.random())]]
          if (newColorOfTwo === 0) {
            board[i].color = 'blue'
            blueCount++
          } else if (newColorOfTwo === 1) {
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

  game (clickColor) {
  // If color clicked is click color then turn it to grey
  // If player gets all three, WIN!
  // If player runs out of Time, LOSE!
    let count = 0
    let time = 20
    const timeDisplay = document.createElement('h2')
    const appendAt = this.shadowRoot.getElementById('time')
    timeDisplay.setAttribute('style', 'color:red')
    appendAt.appendChild(timeDisplay)
    const timer = setInterval(() => {
      if (time === 0) {
        this.restartGame(false)
        clearInterval(timer)
        timeDisplay.remove()
        time = 20
      } else {
        time--
        timeDisplay.innerHTML = `${time}`
      }
    }, 1000)
    const c1r1 = this.shadowRoot.getElementById('tile0')
    c1r1.addEventListener('click', (event) => { count = this.onClick(event, timer, time, count, clickColor, 'left') })
    const c2r1 = this.shadowRoot.getElementById('tile1')
    c2r1.addEventListener('click', (event) => { count = this.onClick(event, timer, time, count, clickColor, 'right') })
    const c3r1 = this.shadowRoot.getElementById('tile2')
    c3r1.addEventListener('click', (event) => { count = this.onClick(event, timer, time, count, clickColor, 'center') })
    const c1r2 = this.shadowRoot.getElementById('tile3')
    c1r2.addEventListener('click', (event) => { count = this.onClick(event, timer, time, count, clickColor, 'left') })
    const c2r2 = this.shadowRoot.getElementById('tile4')
    c2r2.addEventListener('click', (event) => { count = this.onClick(event, timer, time, count, clickColor, 'right') })
    const c3r2 = this.shadowRoot.getElementById('tile5')
    c3r2.addEventListener('click', (event) => { count = this.onClick(event, timer, time, count, clickColor, 'center') })
    const c1r3 = this.shadowRoot.getElementById('tile6')
    c1r3.addEventListener('click', (event) => { count = this.onClick(event, timer, time, count, clickColor, 'left') })
    const c2r3 = this.shadowRoot.getElementById('tile7')
    c2r3.addEventListener('click', (event) => { count = this.onClick(event, timer, time, count, clickColor, 'right') })
    const c3r3 = this.shadowRoot.getElementById('tile8')
    c3r3.addEventListener('click', (event) => { count = this.onClick(event, timer, time, count, clickColor, 'center') })
  }

  onClick (event, timer, time, count, clickColor, pos) {
    const tar = event.target
    const modify = this.shadowRoot.getElementById(`${tar.id}`)
    if (modify.getAttribute('class') === `column-${pos} border ${clickColor}`) {
      tar.setAttribute('class', `column-${pos} border grey`)
      count++
    }
    if (count === 3) {
      clearInterval(timer)
      this.restartGame(true, time)
    }
    return count
  }

  restartGame (value, time) {
    const appendAt = this.shadowRoot.getElementById('board')
    if (value === true) {
      const winLabel = document.createElement('h2')
      winLabel.innerHTML = 'You have won!'
      winLabel.setAttribute('style', 'color:purple')
      const winButton = document.createElement('button')
      winButton.innerHTML = 'Play again?'
      winButton.addEventListener('click', (event) => {
        window.location.reload(false)
      })
      appendAt.appendChild(winLabel).appendChild(winButton)
      /* Display leaderboard
      const itemsInStorage1 = Object.keys(sessionStorage)
      console.log(itemsInStorage1)
      let val = 0
      for (let i = 0; i < itemsInStorage1.length; i++) {
        // Get each player and time from storage
        if (itemsInStorage1[i] === val) {
          val++
        } else {
          break
        }
      }
      sessionStorage.setItem(`${val}`, `${20 - time}`)
      const itemsInStorage = Object.keys(sessionStorage)
      console.log(itemsInStorage)
      const times = []
      for (let i = 0; i < itemsInStorage.length; i++) {
        // Get each time from storage
        const itemFromStorage = sessionStorage.getItem(itemsInStorage[i])
        const obj = { ID: itemsInStorage[i], time: itemFromStorage }
        times.push(obj)
      }
      // Sort players according to time
      const orderedListOfTimes = times.sort((a, b) => { return a.time - b.time })
      // Create leaderboard
      const leaderBoardElement = document.createElement('h2')
      leaderBoardElement.innerHTML = 'Leaderboard'
      leaderBoardElement.setAttribute('style', 'color:blue')
      appendAt.appendChild(leaderBoardElement)
      for (let i = 0; i < orderedListOfTimes.length; i++) {
        const displayPlayer = document.createElement('h3')
        displayPlayer.innerHTML = `Times: ${orderedListOfTimes[i].time}`
        displayPlayer.setAttribute('style', 'color:green')
        appendAt.appendChild(displayPlayer)
      }
      */
    } else if (value === false) {
    // Display that they have failed
      const failMessage = document.createElement('h2')
      failMessage.setAttribute('style', 'color:red')
      failMessage.innerHTML = 'You ran out of time!'
      const failButton = document.createElement('button')
      failButton.innerHTML = 'Play again?'
      failButton.addEventListener('click', (event) => {
        this.createGame()
      })
      appendAt.appendChild(failMessage).appendChild(failButton)
    }
  }

  createGame () {
    const clickColor = this.getClickColor()
    this.tileAssign()
    this.game(clickColor)
  }
}
window.customElements.define('click-game', ClickGame)
export { ClickGame }
