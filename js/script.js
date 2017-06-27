var grid;
var CELL_SIZE; //pixel size of each cell
const GRID_SIZE = 15; //number of cells in a row/col
const CANVAS_W = 401; //1 pixel extra to cover stroke()
const CANVAS_H = 401;
var MINE_COUNT = 25;
var myCanvas;

function setup() {

	grid = [];
	CELL_SIZE = Math.floor(CANVAS_W / GRID_SIZE);
	var MAX_MINES = GRID_SIZE * GRID_SIZE;
	colorMode(RGB, 255, 255, 255, 1);
	// Check if the mine count is more than the maximum allowed for this grid.
	MINE_COUNT = (MINE_COUNT > MAX_MINES) ? MAX_MINES : MINE_COUNT; 

	myCanvas = createCanvas(CANVAS_W, CANVAS_H);
	myCanvas.parent('canvas-holder');

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
	console.log(i + ' ' + j);

	switch(mouseButton) {
		case LEFT:
			if(!grid[i][j].flagged) grid[i][j].reveal();
		break;

		case RIGHT:
			grid[i][j].setFlagged((grid[i][j].flagged ? false : true));
		break;
	}
}

function setMines(count) {
	while(count) {
		let i = Math.floor(random(GRID_SIZE));
		let j = Math.floor(random(GRID_SIZE));

		if(grid[i][j].mine === false) {
			grid[i][j].mine = true;
			count--;
		}
	}

	for(let i = 0; i < GRID_SIZE; i++) {
		for(let j = 0; j < GRID_SIZE; j++) {
			if(!grid[i][j].mine) {
				grid[i][j].setNeighborCount(getNeighborCount(i, j));
			}
		}
	}
}

function getNeighborCount(a, b) {
	var count = 0;

	for(let k = a - 1; k < a + 2; k++) {
		for(let l = b - 1; l < b + 2; l++) {
			if(k >= 0 && l >= 0 && l < GRID_SIZE && k < GRID_SIZE && !(k === a && l === b)) {
				count += grid[k][l].mine ? 1 : 0;
			}
		}
	}

	return count;
}