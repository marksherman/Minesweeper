/*
Author: Aman Bhimani
Git: https://github.com/amanb014/Minesweeper
Original Date: June 2017
*/

// Event Reporter for communication with AI agent
const reporter = new GameReporter();

var CANVAS_W, CANVAS_H; // Width and height of canvas
var GRID_SIZE, CELL_SIZE; // physical dimensions of the board
var MINE_COUNT; // number of mines total on grid

var grid; // 2D array of Object Cell
var mines; // array of all mines on the board
var state; // State of the game
var flags; // Number of flagged cells

// Number of minimum and maximum mines
// Calculated dynamically
var MIN_MINES, MAX_MINES;

// html5 component holders
var scoreHolder; // DOM Element that displays score
var restartBtn; // DOM Element for restart button
var particles; // DOM Element for particle setting
var diff; // DOM Element for difficulty
var myCanvas; // HTML Canvas

// Constants used for game state
const PLAYING = 0;
const WON = 1;
const LOST = 2;

// This method runs once per DOM load
function setup () {
  colorMode(RGB, 255, 255, 255, 1);

  const w = Math.floor(window.innerHeight * 0.8);
  CANVAS_W = CANVAS_H = w < 801 ? w : 801;

  // Reset the game
  userInterface();
  resetGame();

  // Create canvas
  myCanvas = createCanvas(CANVAS_W, CANVAS_H);
  myCanvas.parent('canvas-holder');
}

// Runs as much as 60 times a second.
function draw () {
  // Sets background color
  background(255, 255, 255, 1);

  // Shows all cells in the grid
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j].show();
    }
  }

  // End game can be "won" or "lost"
  // Depending on score
  if (state !== PLAYING) {
    displayEndGame();
  }

  if (state === PLAYING) {
    updateCursorPos();
  }
}

// Sets values related to the DOM and creates events
function userInterface () {
  particles = document.getElementById('particles');
  diff = document.getElementById('difficulty');
  restartBtn = document.getElementById('restart');
  scoreHolder = document.getElementById('score');

  restartBtn.addEventListener('click', resetGame);
  diff.addEventListener('change', resetGame);
}

function mouseReleased () {
  // Is called every time a mouse button is released

  // Position of mouse when released
  const i = Math.floor(mouseX / CELL_SIZE);
  const j = Math.floor(mouseY / CELL_SIZE);

  // Was the mouse released outside of the grid?
  // Are we not currently playing the game?
  if (
    i > GRID_SIZE - 1 ||
    j > GRID_SIZE - 1 ||
    i < 0 ||
    j < 0 ||
    state !== PLAYING
  ) {
    return;
  }

  switch (mouseButton) {
    case LEFT:
      touchCell(i, j);
      break;

    case RIGHT:
      flagCell(i, j);
      break;
  }
}

function touchCell (i, j) {
  reporter.cellTouched(i, j);
  // If the cell is not flagged
  // And is a mine, Game over.
  if (!grid[i][j].flagged) {
    if (grid[i][j].mine) {
      for (let s = 0; s < mines.length; s++) {
        grid[mines[s][0]][mines[s][1]].explode(particles.checked);
      }
      gameOver();
    } else {
      // Show the cell contents
      revealCell(i, j);
    }
  }
}

function flagCell (i, j) {
  // If flagged, remove it.
  if (grid[i][j].flagged) {
    grid[i][j].setFlagged(false);
    flags--;
    reporter.cellUnFlagged(i, j);
  } else if (flags < MINE_COUNT) {
    // Cannot let the user create more flags than there are mines
    grid[i][j].setFlagged(true);
    reporter.cellFlagged(i, j);
    // No need to do checkWin() if flags does not equal mineCount.
    if (++flags !== MINE_COUNT) {
      return;
    }
  } else if (flags >= MINE_COUNT) {
    reporter.cellNotFlagged(i, j);
  }

  checkWin();
}

function resetGame () {
  mines = [];
  grid = [];
  GRID_SIZE = diff.value;

  document.getElementById('ui-holder').style.width = CANVAS_W + 'px';

  // Minimum = 10% of the board are mines
  // Maximum = 14% of the board are mines
  MIN_MINES = 0.1 * GRID_SIZE * GRID_SIZE;
  MAX_MINES = 0.14 * GRID_SIZE * GRID_SIZE;

  // Random number of mines
  MINE_COUNT = Math.floor(random(MIN_MINES, MAX_MINES));

  // Cell size in pixels.
  CELL_SIZE = CANVAS_H / GRID_SIZE;

  // stores the cells in a grid array
  // used for iterating through all the cells
  for (let i = 0; i < GRID_SIZE; i++) {
    const temp = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      temp.push(new Cell(i, j, CELL_SIZE));
    }
    grid.push(temp);
  }

  // Set the mines, playing game, and reset variables
  setMines(MINE_COUNT);
  state = PLAYING;
  flags = 0;
  updateScore(0);
  reporter.gameReset();
}

//* ****************************\\
//          Helpers            \\

// Sets count amount of mines in the global grid
function setMines (count) {
  while (count) {
    const i = Math.floor(random(GRID_SIZE));
    const j = Math.floor(random(GRID_SIZE));

    if (grid[i][j].mine === false) {
      mines.push([i, j]);
      grid[i][j].mine = true;
      count--;
    }
  }

  // Set the neighbor counts on the grid.
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (!grid[i][j].mine) {
        grid[i][j].setNeighborCount(thisManyMines(getNeighbors(i, j)));
      }
    }
  }
}

// Returns number of mines in the input list
function thisManyMines (list) {
  var count = 0;
  for (let x = 0; x < list.length; x++) {
    count += grid[list[x][0]][list[x][1]].mine ? 1 : 0;
  }
  return count;
}

// Returns an array of objects that contains
// the neighbors of that coordinate pair
function getNeighbors (i, j) {
  var neighbors = [];

  for (let k = i - 1; k < i + 2; k++) {
    for (let l = j - 1; l < j + 2; l++) {
      if (
        k >= 0 &&
        l >= 0 &&
        l < GRID_SIZE &&
        k < GRID_SIZE &&
        !(k === i && l === j)
      ) {
        neighbors.push([k, l]);
      }
    }
  }

  return neighbors;
}

// Is called when a cell is clicked and is not flagged.
// RECURSIVE CALLS
function revealCell (i, j) {
  if (!grid[i][j].flagged) {
    grid[i][j].reveal();
    reporter.cellRevealed(i, j);
  }

  // If the neighbor has 0 mines, reveal it.
  if (grid[i][j].neighborMines === 0) {
    const myNeighbors = getNeighbors(i, j);
    for (let s = 0; s < myNeighbors.length; s++) {
      if (!grid[myNeighbors[s][0]][myNeighbors[s][1]].revealed) {
        revealCell(myNeighbors[s][0], myNeighbors[s][1]);
      }
    }
  }
}

// Set game state lost
function gameOver () {
  updateScore(score());
  state = LOST;
  reporter.gameLost();
}

// Set game state to win
function gameWon () {
  updateScore(score());
  state = WON;
  reporter.gameWon();
}

// DOM manipulation based on game state
function displayEndGame () {
  fill(240, 240, 240, 0.8);
  noStroke();
  rect(0, CANVAS_H / 4, CANVAS_W, CANVAS_H / 2);

  textSize(CANVAS_W / 8);
  textAlign(CENTER);
  noStroke();
  fill(50, 50, 50, 0.7);

  let msg;
  if (state === WON) {
    fill(0, 142, 9, 1);
    msg = 'You Won!';
  } else {
    fill(255, 3, 3, 1);
    msg = 'You Lost!';
  }

  text(msg, CANVAS_W / 2, CANVAS_H / 2);

  textSize(CANVAS_W / 16);
  msg = `SCORE: ${score()} / 100`;
  text(msg, CANVAS_W / 2, CANVAS_H / 2 + 80);
}

// Update DOM element with score (once game is over)
function updateScore (s) {
  scoreHolder.innerHTML = `Score: ${s} / 100`;
}

// Borrow the score DOM element to show the current grid postion under cursor
function updateCursorPos () {
  // Position of mouse
  let i = Math.floor(mouseX / CELL_SIZE);
  let j = Math.floor(mouseY / CELL_SIZE);
  i = constrain(i, 0, GRID_SIZE);
  j = constrain(j, 0, GRID_SIZE);
  scoreHolder.innerHTML = `${i}, ${j}`;
}

// Are all the mines flagged?
function checkWin () {
  if (minesFlagged() === mines.length) gameWon();
}

// Goes through each cell object that is a mine
// And returns the number of them that are flagged.
function minesFlagged () {
  let count = 0;
  for (let i = 0; i < mines.length; i++) {
    if (grid[mines[i][0]][mines[i][1]].flagged) {
      count++;
    }
  }
  return count;
}

// Returns the score in a percentage format.
var score = () => Math.floor(minesFlagged() / MINE_COUNT * 100);
