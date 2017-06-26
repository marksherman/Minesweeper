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
	

	if(this.revealed) {
		if(this.mine) {
			fill(0);
			let offset = (this.size / 2);
			ellipse(this.x + offset, this.y + offset, this.size/2);
		} else {
			fill(200);
			rect(this.x, this.y, this.size, this.size);
			//not a mine
			//show the number, if nevessary
		}
	}
	//Not revealed yet
	else {
		noFill();
		rect(this.x, this.y, this.size, this.size);
	}
}

