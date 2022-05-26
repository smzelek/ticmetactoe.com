
// TODO: menu controls affect state properly
// test("if I've played in squares, I can reset the game", async ({ page }) => {
//   for (let i = 0; i < 9; ++i) {
//     app(page).getSquare(i, (i + 1) % 9).click();
//   }
//   const length = app(page).board.getText().then((text) => text.replace(/\s+/g, "").length)
//   expect(length).toBeGreaterThan(0);

//   app(page).newGame.click();
//   text = app(page).board.getText().then((text) => text.replace(/\s+/g, ""))
//   expect(text).toBe("");
// })

// TODO: menu controls
// test("I can reset it", async ({ page }) => {
//   const line = page.locator(".xline");
//   await expect(line).toBeVisible();

//   const numMarks = app.board.getText().then((text) => text.replace(/\s+/g, "").length)
//   expect(numMarks).toBeGreaterThan(0);

//   app.newGame.click();
//   text = app.board.getText().then((text) => text.replace(/\s+/g, ""))
//   expect(text).toBe("");
//   expect(line.isPresent()).toBe(false);
// });

// test("I can reset the game", async ({ page }) => {
//   app.xWins();
//   const line = element(by.css(".xline"));
//   expect(line.isPresent()).toBe(true);
//   const numMarks = app.board.getText().then((text) => text.replace(/\s+/g, "").length)
//   expect(numMarks).toBeGreaterThan(0);
//   const boardMarks = element(by.css(".winningBoard"));
//   expect(boardMarks.isPresent()).toBe(true);

//   app.newGame.click();
//   const text = app.board.getText().then((text) => text.replace(/\s+/g, ""))
//   expect(text).toBe("");
//   expect(line.isPresent()).toBe(false);
//   expect(boardMarks.isPresent()).toBe(false);
// });
