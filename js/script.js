var grid;
var CELL_SIZE; //pixel size of each cell
const GRID_SIZE = 20; //number of cells in a row/col
const CANVAS_W = 401; //1 pixel extra to cover stroke()
const CANVAS_H = 401;

function setup() {

	createCanvas(CANVAS_W, CANVAS_H);
	CELL_SIZE = Math.floor(CANVAS_W / GRID_SIZE);

	grid = [];

	//stores the cells in a grid array
	//used for iterating through all the cells
	for(let i = 0; i < GRID_SIZE; i++) {
		let temp = []
		for(let j = 0; j < GRID_SIZE; j++) {
			temp.push(new Cell(i, j, CELL_SIZE));
		}
		grid.push(temp);
	}
}

function draw() {
	background(127);

	for(let i = 0; i < GRID_SIZE; i++) {
		for(let j = 0; j < GRID_SIZE; j++) {
			grid[i][j].show();
		}
	}
}