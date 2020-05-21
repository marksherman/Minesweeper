class GameReporter {
  cellTouched (i, j) { console.log(`☝️ Cell touched at ${i}, ${j}`); }
  cellUnFlagged (i, j) { console.log(`🏳️Cell un-flagged at ${i}, ${j}`); }
  cellFlagged (i, j) { console.log(`🚩Cell flagged at ${i}, ${j}`); }
  cellNotFlagged (i, j) { console.log(`Cell NOT flagged at ${i}, ${j}`); }
  gameReset () { console.log('🔁Game reset'); }
  gameLost () { console.log('💔Game lost'); }
  gameWon () { console.log('❤️Game won'); }
  cellRevealed (i, j) { console.log(`🔲Cell revealed at ${i}, ${j}`); }
  aiTouch (i, j) { console.log(`AI touched ${i}, ${j}`); }
  aiFlag (i, j) { console.log(`AI flagged ${i}, ${j}`); }
}
