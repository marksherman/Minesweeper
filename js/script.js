var GRID_SIZE; 	//number of cells in a row/col
var diff;
var CANVAS_W; 	//1 pixel extra to cover stroke()
var CANVAS_H;
var MINE_COUNT;		// number of mines total on grid
var myCanvas;			// html canvas reference
var grid, mines, state, flagCount, CELL_SIZE;
const PLAYING = 0, WON = 1, LOST = 2;

var MIN_MINES, MAX_MINES;

//html5 component holders
var scoreHolder, restartBtn, particles;

function setup() {

	userInterface();
	resetGame();
	
	colorMode(RGB, 255, 255, 255, 1);
	myCanvas = createCanvas(CANVAS_W, CANVAS_H);
	myCanvas.parent('canvas-holder');

}

function draw() {
	background(255, 255, 255, 1);

	for(let i = 0; i < GRID_SIZE; i++) {
		for(let j = 0; j < GRID_SIZE; j++) {
			grid[i][j].show();
		}
	}
}

function mouseReleased() {
	let i = Math.floor(mouseX / CELL_SIZE);
	let j = Math.floor(mouseY / CELL_SIZE);

	if(i > GRID_SIZE-1 || j > GRID_SIZE-1 || i < 0 || j < 0 || (state !== PLAYING)) return;

	switch(mouseButton) {
		case LEFT:

			if(!grid[i][j].flagged) {
				if(grid[i][j].mine) {
					for(let s = 0; s < mines.length; s++) {
						grid[mines[s][0]][mines[s][1]].explode(particles.checked);
					}
					gameOver();
				} else {
					revealCell(i, j);
				}
			}

		break;

		case RIGHT:

			if(grid[i][j].flagged) {
				grid[i][j].setFlagged(false);
				flagCount--;
			} else if(flagCount < MINE_COUNT) {
				grid[i][j].setFlagged(true);
				flagCount++;
			}
			checkWin();
		break;
	}
}

function setMines(count) {

	while(count) {
		let i = Math.floor(random(GRID_SIZE));
		let j = Math.floor(random(GRID_SIZE));

		if(grid[i][j].mine === false) {

			mines.push([i, j]);
			grid[i][j].mine = true;
			count--;

		}
	}

	for(let i = 0; i < GRID_SIZE; i++) {
		for(let j = 0; j < GRID_SIZE; j++) {
			if(!grid[i][j].mine) {
				grid[i][j].setNeighborCount(thisManyMines(getNeighbors(i, j)));
			}
		}
	}
}

//This is used to pass in a list and find out HOW MANY of those are mines.
function thisManyMines(list) {
	var count = 0;
	for(let x = 0; x < list.length; x++) {
		count += grid[list[x][0]][list[x][1]].mine ? 1 : 0;
	}
	return count;
}

//Returns an array of objects that contains
//the neighbors of that coordinate pair
function getNeighbors(i, j) {
	var neighbors = [];

	for(let k = i - 1; k < i + 2; k++) {
		for(let l = j - 1; l < j + 2; l++) {
			if(k >= 0 && l >= 0 && l < GRID_SIZE && k < GRID_SIZE && !(k === i && l === j)) {
				neighbors.push([k, l]);
			}
		}
	}

	return neighbors;
}

function revealCell(i, j) {
	if(!grid[i][j].flagged) {
		grid[i][j].reveal();
	}

	if(grid[i][j].neighborMines === 0) {
		let myNeighbors = getNeighbors(i, j);
		for(let s = 0; s < myNeighbors.length; s++) {
			if(!grid[myNeighbors[s][0]][myNeighbors[s][1]].revealed) {
				revealCell(myNeighbors[s][0], myNeighbors[s][1]);
			}
		}
	}
}

function gameOver() {
	updateScore(score());
	state = LOST;
}

function gameWon() {
	updateScore(score());
	state = WON;
}

function resetGame() {
	mines = [];
	grid = [];
	GRID_SIZE = diff.value;

	document.getElementById('ui-holder').style.width = CANVAS_W + 'px';

	let tempWidth = Math.floor(window.innerWidth * 0.8);
	CANVAS_W = CANVAS_H = tempWidth < 801 ? tempWidth : 801;

	//Minimum = 15% of the board are mines
	//Maximum = 20% of the board are mines
	MIN_MINES = 0.15 * GRID_SIZE * GRID_SIZE;
	MAX_MINES = 0.20 * GRID_SIZE * GRID_SIZE;

	MINE_COUNT = Math.floor(random(MIN_MINES, MAX_MINES));
	CELL_SIZE = Math.floor(CANVAS_W / GRID_SIZE);

	//stores the cells in a grid array
	//used for iterating through all the cells
	for(let i = 0; i < GRID_SIZE; i++) {
		let temp = []
		for(let j = 0; j < GRID_SIZE; j++) {
			temp.push(new Cell(i, j, CELL_SIZE));
		}
		grid.push(temp);
	}

	//Randomly set the mines around the map
	setMines(MINE_COUNT);
	state = PLAYING;
	flagCount = 0;

	updateScore(0);

}

function checkWin() {
	if(minesFlagged() === mines.length) gameWon();
}

function minesFlagged() {
	let count = 0;
	for(let i = 0; i < mines.length; i++) {
		if( grid[mines[i][0]][mines[i][1]].flagged ) {
			count++;
		}
	}
	return count;
}
var score = () => (Math.floor((minesFlagged() / MINE_COUNT) * 100));

// USER INTERFACE AND INTERACTION
// BEGINS HERE
function userInterface() {
	particles = document.getElementById('particles');

	diff = document.getElementById('difficulty');
	restartBtn = document.getElementById('restart');
	scoreHolder = document.getElementById('score');
	restartBtn.addEventListener('click', resetGame);
	diff.addEventListener('change', resetGame);
}

function updateScore(s) {
	scoreHolder.innerHTML = 'Score: ' + s;
}
