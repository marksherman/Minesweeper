var grid;
var CELL_SIZE; //pixel size of each cell
const GRID_SIZE = 20; //number of cells in a row/col
const CANVAS_W = 401; //1 pixel extra to cover stroke()
const CANVAS_H = 401;
var MINE_COUNT = 50;

function setup() {

	grid = [];
	CELL_SIZE = Math.floor(CANVAS_W / GRID_SIZE);
	var MAX_MINES = GRID_SIZE * GRID_SIZE;

	// Check if the mine count is more than the maximum allowed for this grid.
	MINE_COUNT = (MINE_COUNT > MAX_MINES) ? MAX_MINES : MINE_COUNT; 

	createCanvas(CANVAS_W, CANVAS_H);

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
	background(127);

	for(let i = 0; i < GRID_SIZE; i++) {
		for(let j = 0; j < GRID_SIZE; j++) {
			grid[i][j].show();
		}
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
}