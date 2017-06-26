/* Each individual cell for the minesweeper game
This is only a prototype/class.
Implementation done in script.js */

function Cell(i, j, size) {
	this.x = i * size;
	this.y = j * size;

	this.mine = false;
	this.revealed = true;
	this.size = size;
}

Cell.prototype.show = function() {
	stroke(0);
	fill(200);
	rect(this.x, this.y, this.size, this.size);
}