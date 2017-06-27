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
	this.neighborMines = -1;
}

Cell.prototype.show = function() {
	stroke(0);
	var offset = (this.size / 2);
	// If this block is revealed,
	// then if it's a mine show/animate a mine
	// if its not, show a number or block
	if(this.revealed) {
		if(this.mine) {
			fill(250,105,0, 0.8);
			rect(this.x, this.y, this.size, this.size);
			fill(40, 40, 40, 1);
			ellipse(this.x + offset, this.y + offset, this.size/2);
		}
		// NOT a mine
		else {
			fill(105,210,231, 0.6);
			rect(this.x, this.y, this.size, this.size);

			textSize(this.size);
			textAlign(CENTER);
			noStroke();
			fill(50, 50, 50, 0.7);
			text(this.neighborMines, this.x + offset, this.y + (offset * 1.75));


		}
	}
	// NOT revealed yet
	else {
		if(this.flagged) {
			fill(105,210,231, 0.7);
			rect(this.x, this.y, this.size, this.size);

			textSize(this.size);
			textAlign(CENTER);
			noStroke();
			fill(50, 50, 50, 0.7);
			text('?', this.x + offset, this.y + (offset * 1.75));
		} else {
			fill(105,210,231, 1);
			rect(this.x, this.y, this.size, this.size);
		}
	}
}

Cell.prototype.reveal = function() {
	this.revealed = true;
}

Cell.prototype.setFlagged = function(flag) {
	this.flagged = flag;
}

Cell.prototype.setNeighborCount = function(c) {
	this.neighborMines = c;
}