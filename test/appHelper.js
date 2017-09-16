function getSquare(b, i) {
  return $$(".square").get(b * 9 + i);
}

function getBoard(b) {
  return $$(".board").get(b);
}

function xWins() {
  getSquare(0, 1).click();
  getSquare(1, 0).click();
  getSquare(0, 4).click();
  getSquare(4, 0).click();
  getSquare(0, 7).click();
  getSquare(7, 8).click();
  getSquare(8, 0).click();
  getSquare(0, 8).click();
  getSquare(8, 4).click();
  getSquare(4, 8).click();
  getSquare(8, 8).click();
  getSquare(8, 7).click();
  getSquare(7, 7).click();
  getSquare(7, 4).click();
  getSquare(4, 3).click();
  getSquare(3, 4).click();
  getSquare(4, 5).click();
  getSquare(5, 4).click();
  getSquare(4, 4).click();
}

function oWins() {
  getSquare(0, 0).click();
  xWins();
}

module.exports = {
  title: element(by.css("#game h2")),
  footer: element(by.css("#footer")),
  board: element(by.css("#board")),
  newGame: element(by.css("#new-game")),
  winner: element(by.css('#winner')),

  getSquare: getSquare,
  getBoard: getBoard,
  xWins: xWins,
  oWins: oWins
};