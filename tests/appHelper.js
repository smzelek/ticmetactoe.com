function getSquare(page, b, i) {
  return page.locator(".square").nth(b * 9 + i);
}

function getBoard(page, b) {
  return page.locator(".board").nth(b);
}

const xWins = async (page) => {
  await getSquare(page, 0, 1).click();
  await getSquare(page, 1, 0).click();
  await getSquare(page, 0, 4).click();
  await getSquare(page, 4, 0).click();
  await getSquare(page, 0, 7).click();
  await getSquare(page, 7, 8).click();
  await getSquare(page, 8, 0).click();
  await getSquare(page, 0, 8).click();
  await getSquare(page, 8, 4).click();
  await getSquare(page, 4, 8).click();
  await getSquare(page, 8, 8).click();
  await getSquare(page, 8, 7).click();
  await getSquare(page, 7, 7).click();
  await getSquare(page, 7, 4).click();
  await getSquare(page, 4, 3).click();
  await getSquare(page, 3, 4).click();
  await getSquare(page, 4, 5).click();
  await getSquare(page, 5, 4).click();
  await getSquare(page, 4, 4).click();
}

const oWins = async (page) => {
  await getSquare(page, 0, 0).click();
  await xWins(page);
}

const appHelper = (page) => {
  return {
    title: () => page.locator("#whiteboard h2"),
    footer: () => page.locator("#footer"),
    board: () => page.locator("#board"),
    quit: () => page.locator("#quit"),
    winner: () => page.locator('#winner > span').nth(0),
    getSquare: (b, i) => getSquare(page, b, i),
    getBoard: (b) => getBoard(page, b),
    xWins: async () => xWins(page),
    oWins: async () => oWins(page)
  }
};

module.exports = appHelper;