/* Each individual cell for the minesweeper game
This is only a prototype/class.
Implementation done in script.js */

function Cell(i, j, size) {
	this.x = i * size;
	this.y = j * size;

	this.mine = false;
	this.revealed = false;
	this.size = size;
	this.flagged = false;
}

Cell.prototype.show = function() {
	stroke(0);

	// If this block is revealed,
	// then if it's a mine show/animate a mine
	// if its not, show a number or block
	if(this.revealed) {
		if(this.mine) {
			fill(250,105,0, 0.8);
			rect(this.x, this.y, this.size, this.size);
			let offset = (this.size / 2);
			fill(12, 12, 12, 1);
			ellipse(this.x + offset, this.y + offset, this.size/2);
		}
		// NOT a mine
		else {
			fill(105,210,231, 0.6);
			rect(this.x, this.y, this.size, this.size);

		}
	}
	// NOT revealed yet
	else {
		fill(105,210,231, 1);
		rect(this.x, this.y, this.size, this.size);
	}
}

Cell.prototype.reveal = function() {
	this.revealed = true;
}

Cell.prototype.flag = function() {
	this.flagged = true;
}