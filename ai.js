// Here are the tools to use to build your AI:

// GRID_SIZE -> number, the size of the grid (length or width)

// grid[i][j] -> a matrix of Cells
// each cell has the following properties (that are useful/allowed):
//  .revealed -> true/false
//  .flagged  -> true/false
//  .neighborMines -> number of mines in the surrounding 8 cells
//                 -> not valid unless .revealed is true
//                 -> if value is -1, neighbors are not yet known

// function touch (i, j)
// -> touch the given cell
// -> returns nothing

// function flag (i, j)
// -> flags the given cell as a bomb. Un-flags if it's already flagged.
// -> returns nothing

// function getNeighbors (i, j)
// -> returns an array [] of coordinates [i, j] of neighbor cells

class AI {
  constructor (touch, flag) {
    this.author = 'Mark Sherman';
    this.authorEmail = 'shermanm@emmanuel.edu';

    this.touch = touch;
    this.flag = flag;
  }

  move () {
    // In here you do whatever you need to do to Make a Move.
    // Each time makeMove is called, it must make ONE call to either
    // the touch function or flag function.
    console.log(`😷😷😷AI made a move! at ${millis()}`);
    const i = floor(random(0, GRID_SIZE - 1));
    const j = floor(random(0, GRID_SIZE - 1));
    this.touch(i, j);
  }
}
