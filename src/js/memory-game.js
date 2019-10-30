// Template for memory-game custom element
const template = document.createElement('template')
template.innerHTML = `
<style>
.grid-container {
  display: grid; 
  grid-template-columns: auto auto auto auto; 
  grid-column-gap: 50px; 
}

.memory-game {
  height: 100%; 
  width: 100%; 
  padding: 2px; 
  border-style: solid; 
  border-color: blue; 
  text-align: left;  
  background-color: black; 
  color: white; 
}

.fixed-ratio-resize { /* basic responsive img */
  max-width: 100%;
  height: auto;
  width: auto\9; /* IE8 */
}

img {
  height: 75%;
  width: 75%; 
  float: left; 
  top: 2px; 
  bottom: 2px; 
  left: 2px; 
  right: 2px; 
  padding: 0 2%; 
}

label {
    background-color: black; 
    color: white; 
} 
button {
    width: 50px; 
    height: 20px; 
    text-align: center;
    font-family: 'marske';
}
</style>
<div class="memory-game" id ='memory-game'>
    <h2> MemoryGame </h2>
    <br>
    <div class="grid-container" id='grid-container'></div>
</div>
`
class MemoryGame extends window.HTMLElement {
  /**
   * Creates an instance of the MemoryGame custom element
   * @param {*} rows - number of rows for memory game
   * @param {*} cols - number of columns for memory game
   */
  constructor (rows = 2, cols = 2) {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.parentDiv = this.shadowRoot.querySelector('#memory-game')
    this.parentDiv.addEventListener('click', (event) => {
      event.target.focus()
    })
    this.grid = this.shadowRoot.querySelector('#grid-container')
    this.rows = rows
    this.cols = cols
  }

  /**
   * Creates the board by getting the dimensions from the user and if they are valid
   * inputs, uses them to create the board, otherwise creating a 2 X 2 board.
   * Creates the board from the images provided and calls the shuffleBoard method to
   * shuffle.
   * @param {*} rows - number of rows
   * @param {*} cols - number of columns
   */
  createBoard (rows, cols) {
    // Ask user for dimensions
    const queryParams = document.createElement('label')
    queryParams.innerHTML = 'Please enter desired dimensions (even, i.e. 2 X 2) of game'
    const paramsFieldRows = document.createElement('input')
    const paramsFieldColumns = document.createElement('input')
    const submitButton = document.createElement('button')
    submitButton.innerHTML = 'Submit'
    submitButton.addEventListener('click', () => {
      // If inputs are valid, create board
      if ((paramsFieldRows.value % 2 === 0) && (paramsFieldColumns.value % 2 === 0)) {
        rows = paramsFieldRows.value
        cols = paramsFieldColumns.value
      } else {
        // Otherwise construct a default 2 X 2 board
        rows = 2
        cols = 2
      }
      queryParams.remove()
      paramsFieldRows.remove()
      paramsFieldColumns.remove()
      submitButton.remove()
      // Make the board
      this.rows = rows
      this.cols = cols
      let board = []
      const images = [1, 2, 3, 4, 5, 6, 7, 8]
      for (let i = 0; i < this.rows * this.cols / 2; i++) {
        board.push(images[i])
        board.push(images[i])
      }
      // Shuffle the board
      board = this.shuffleBoard(board)
      // Show the board
      this.showBoard(board)
    })
    // append elements for above functionality
    this.parentDiv.appendChild(queryParams).appendChild(paramsFieldRows)
    this.parentDiv.appendChild(paramsFieldColumns)
    this.parentDiv.appendChild(submitButton)
  }

  /**
   * Shuffles and returns the board
   * @param {*} board - gets the board and shuffles it
   */
  shuffleBoard (board) {
    for (let i = (board.length - 1); i > 0; i--) {
      const randIndex = Math.floor(board.length * Math.random())
      const temp = board[i]
      board[i] = board[randIndex]
      board[randIndex] = temp
    }
    return board
  }

  /**
   * Sets the board up on the screen, image by image in a grid
   * @param {*} board - gets the board and shows it
   */
  showBoard (board) {
    // Goes through each image in the board and puts it in the grid
    for (let i = 0; i < board.length; i++) {
      const img = document.createElement('img')
      const aTag = document.createElement('a')
      aTag.setAttribute('href', '#')
      aTag.setAttribute('id', `a${i}`)
      img.setAttribute('src', 'image/0.png')
      img.setAttribute('id', `img${i}`)
      img.setAttribute('val', `image/${board[i]}.png`)
      img.setAttribute('class', 'fixed-ratio-resize')
      this.grid.appendChild(aTag).appendChild(img)
    }
    // playGame!
    this.playGame(board)
  }

  /**
   * Game play method for memoryGame, allows user to find pairs in the board and
   * hides (or eliminates) images based on user input
   * @param {*} board - gets board and manipulates it as the game is played
   */
  playGame (board) {
    let clickNum = 0
    let first
    let second
    let numHidden = 0
    // For each image, set up an eventListener
    for (let i = 0; i < board.length; i++) {
      const a = this.shadowRoot.getElementById(`a${i}`)
      a.addEventListener('click', (event) => {
        clickNum++
        const img = event.target.nodeName === 'IMG' ? event.target : event.target.firstElementChild
        if (clickNum === 1) {
          // Show that tile
          first = img
          const val = first.getAttribute('val')
          first.setAttribute('src', val)
          return first
        } else if (clickNum === 2 && (first.getAttribute('val') === event.target.getAttribute('val') && (first.id !== event.target.id))) {
          // Remove those tiles if they match
          first.style.visibility = 'hidden'
          event.target.style.visibility = 'hidden'
          numHidden += 2
          // If user is done, call restartGame
          if (numHidden === (this.rows * this.cols)) {
            this.restartGame()
          }
          clickNum = 0
        } else if (clickNum === 2 && (first.getAttribute('val') !== event.target.getAttribute('val'))) {
          // Display second tile
          second = img
          const val = second.getAttribute('val')
          second.setAttribute('src', val)
          return second
        } else if (clickNum === 3) {
          // Hide the tiles since user didn't find a match
          first.setAttribute('src', 'image/0.png')
          second.setAttribute('src', 'image/0.png')
          clickNum = 0
        }
      })
    }
  }

  /**
   * Restart the game
   */
  restartGame () {
    // Reset the grid
    while (this.grid.firstChild) {
      this.grid.removeChild(this.grid.firstChild)
    }
    // Ask user if they want to play again and if so, restart the game
    const notify = document.createElement('label')
    notify.innerHTML = 'Game Completed Play Again?'
    const playAgainButton = document.createElement('button')
    playAgainButton.innerHTML = 'Yes!'
    this.grid.appendChild(notify).appendChild(playAgainButton)
    playAgainButton.addEventListener('click', (event) => {
      notify.remove()
      playAgainButton.remove()
      this.createBoard(this.rows, this.cols)
    })
  }
}
window.customElements.define('memory-game', MemoryGame)

export { MemoryGame }
