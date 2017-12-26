/* 
Author: Aman Bhimani
Git: https://github.com/amanb014/Minesweeper
Original Date: June 2017
*/

function Cell(i, j, size) {
	this.x = i * size;
	this.y = j * size;

	this.mine = false;
	this.revealed = false;
	this.size = size;
	this.flagged = false;
	this.neighborMines = -1;

	this.particles = [];

	this.show = function() {
		stroke(0,0,0,0.2);
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
				if(this.neighborMines !== 0) {
					text(this.neighborMines, this.x + offset, this.y + (offset * 1.75));
				}


			}
		}
		// NOT revealed yet
		else {
			if(this.flagged) {
				fill(244,221,81, 0.7);
				rect(this.x, this.y, this.size, this.size);

				textSize(this.size);
				textAlign(CENTER);
				noStroke();
				fill(50, 50, 50, 0.7);
				text('?', this.x + offset, this.y + (offset * 1.75));
			} 
			//not flagged
			else {
				fill(105,210,231, 1);
				rect(this.x, this.y, this.size, this.size);
			}
		}

		//Display all particles (if any)
		if(this.particles.length) {
			for(let b = this.particles.length - 1; b >= 0; b--) {
				if(this.particles[b].lifetime > 0) {
					this.particles[b].show();
				}
			}
		}
	}

	this.reveal = function() {
		this.revealed = true;
	}

	this.setFlagged = function(flag) {
		this.flagged = flag;
	}

	this.setNeighborCount = function(c) {
		this.neighborMines = c;
	}


	this.explode = function(particles) {
		this.revealed = true;
		let s = this.size * 0.50;

		if(!particles) return;

		for(let i = 0; i < 4; i++) {
			let randVect = createVector(Math.floor(random(-6, 6)), Math.floor(random(-6, 6)));
			this.particles.push(new Particle(this.x, this.y, randVect, s));
		}
	}
}

function Particle(x, y, vel, size) {
	this.accel = createVector(0, 0.4);
	this.lifetime = 50;
	this.pos = createVector(x, y);
	this.vel = vel;
	this.size = size;

	this.show = () => {
		this.lifetime += (this.lifetime > 0) ? -1 : 0;
		if(this.lifetime > 0) {
			this.lifetime--;

			//Update position based on velocity
			this.pos.add(this.vel);

			//Update velocity based on acceleration
			this.vel.add(this.accel);

			//Add some drag
			// this.vel.x += 2;

			fill(35, 35, 35, this.lifetime / 100);
			noStroke();
			ellipse(this.pos.x, this.pos.y, this.size);

		}
	}
}