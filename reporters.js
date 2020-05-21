class GameReporter {
  constructor () {
    this.cellTouched = (i, j) => console.log(`☝️ Cell touched at ${i}, ${j}`);
    this.cellUnFlagged = (i, j) => console.log(`🏳️Cell un-flagged at ${i}, ${j}`);
    this.cellFlagged = (i, j) => console.log(`🚩Cell flagged at ${i}, ${j}`);
    this.cellNotFlagged = (i, j) => console.log(`Cell NOT flagged at ${i}, ${j}`);
    this.gameReset = () => console.log('🔁Game reset');
    this.gameLost = () => console.log('💔Game lost');
    this.gameWon = () => console.log('❤️Game won');
    this.cellRevealed = (i, j) => console.log(`🔲Cell revealed at ${i}, ${j}`);
  }
}
