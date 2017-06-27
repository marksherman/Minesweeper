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

	if(!(i <= GRID_SIZE && j <= GRID_SIZE)) return;

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
				grid[i][j].setNeighborCount(thisManyMines(getNeighbors(i, j)));
			}
		}
	}
}

//This is used to pass in a list and find out HOW MANY of those are mines.
function thisManyMines(list) {
	var count = 0;
	for(let x = 0; x < list.length; x++) {
		count += grid[list[x].i][list[x].j].mine ? 1 : 0;
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
				let obj = {
					i: k,
					j: l
				};
				neighbors.push(obj);
			}
		}
	}

	return neighbors;
}