const app = require('./appHelper.js');

const { test, expect } = require('@playwright/test');

test.describe("local play", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('#local-play')
  });

  test.describe("when I view the app", () => {
    test("displays the title in the browser", async ({ page }) => {
      const title = await page.title();
      expect(title).toBe("Tic Metac Toe");
    });

    test("shows credit in the footer", async ({ page }) => {
      await expect(app(page).footer()).toBeVisible();
      await expect(app(page).footer()).toHaveText("Coded by Steve Zelek using React / NodeJS");
    });

    test("shows the title of the app", async ({ page }) => {
      await expect(app(page).title()).toBeVisible();
      await expect(app(page).title()).toHaveText("Tic Metac Toe");
    });

    test("shows a blank board", async ({ page }) => {
      await expect(app(page).board()).toBeVisible();
      await expect(app(page).board()).toHaveText("");
    });

    test("shows a quit button", async ({ page }) => {
      await expect(app(page).quit()).toBeVisible();
      await expect(app(page).quit()).toHaveText("quit?")
    });

    test("does not show a winner", async ({ page }) => {
      await expect(app(page).winner()).not.toBeVisible();
    });
  });

  test.describe("When I play in squares", () => {
    test("lets me place a marker", async ({ page }) => {
      const square = app(page).getSquare(0, 0);
      await square.click();
      await expect(square).toHaveText("x");
    });

    test("lets me take turns", async ({ page }) => {
      const xsquare = app(page).getSquare(0, 0);
      await xsquare.click();
      await expect(xsquare).toHaveText("x");

      const osquare = app(page).getSquare(0, 1);
      await osquare.click();
      await expect(osquare).toHaveText("o");
    });

    test.describe("cannot play outside active board", () => {
      for (let activeB = 0; activeB < 9; ++activeB) {
        test(`when the active board is [b${activeB}]`, async ({ page }) => {
          await app(page).getSquare(0, activeB).click();
          const boards = [...Array(9).keys()].filter(b => b !== activeB);
          for (b of boards) {
            for (let s = 0; s < 9; ++s) {
              await app(page).getSquare(b, s).click();
            }
          }
          await expect(app(page).board()).toHaveText("x");
        });
      }
    });

    test.describe("can play anywhere inside active board", () => {
      for (let activeB = 0; activeB < 9; ++activeB) {
        test(`when the active board is [b${activeB}]`, async ({ page }) => {
          for (let s = 0; s < 9; ++s) {
            await page.goto('/');
            await page.click('#local-play')
            await app(page).getSquare(activeB === 0 ? 1 : 0, activeB).click();
            await app(page).getSquare(activeB, s).click();
            await expect(app(page).board()).toHaveText(activeB === 0 ? "ox" : "xo");
          }
        });
      }
    });

    test("if I play in a square, the matching board is highlighted", async ({ page }) => {
      for (let activeB = 0; activeB < 9; ++activeB) {
        await page.goto('/');
        await page.click('#local-play')
        await app(page).getSquare(0, activeB).click();
        await expect(app(page).getBoard(activeB)).toHaveClass(/currentBoard/);
      }
    });

    test("if I play in a square, it cannot be played in again", async ({ page }) => {
      const square = await app(page).getSquare(0, 0);
      await square.click();
      await expect(square).toHaveText("x");

      await square.click();
      await expect(square).toHaveText("x");
    });

    test("when [b0] is the active board, but [b0] is full, I can play anywhere", async ({ page }) => {
      for (let b = 1; b < 9; ++b) {
        await page.goto('/');
        await page.click('#local-play');

        const fillBoard0 = async () => {
          const moves = [
            [0, 0], [0, 1],
            [1, 0], [0, 2],
            [2, 0], [0, 3],
            [3, 0], [0, 4],
            [4, 0], [0, 5],
            [5, 0], [0, 6],
            [6, 0], [0, 7],
            [7, 0], [0, 8],
            [8, 0]
          ];
          for ([x, y] of moves) {
            await app(page).getSquare(x, y).click();
          }
        };

        await fillBoard0();

        const square = await app(page).getSquare(b, 1);
        await square.click();
        await expect(square).toHaveText("o");
      }
    });
  });

  test.describe("When I win a board", () => {
    test.beforeEach(async ({ page }) => {
      const winBoard4 = async () => {
        await app(page).getSquare(4, 0).click();
        await app(page).getSquare(0, 4).click();
        await app(page).getSquare(4, 1).click();
        await app(page).getSquare(1, 4).click();
        await app(page).getSquare(4, 2).click();
      };

      await winBoard4();
    });

    test("I get a line", async ({ page }) => {
      const line = page.locator(".xline");
      await expect(line).toHaveCount(1);
    });

    test("I can't get another line in that board", async ({ page }) => {
      const secondTriadInBoard4 = async () => {
        await app(page).getSquare(2, 2).click();
        await app(page).getSquare(2, 4).click();
        await app(page).getSquare(4, 3).click();
        await app(page).getSquare(3, 4).click();
        await app(page).getSquare(4, 5).click();
        await app(page).getSquare(5, 4).click();
        await app(page).getSquare(4, 4).click();
      };

      await secondTriadInBoard4();

      const xline = page.locator(".xline");
      await expect(xline).toHaveCount(1);

      const oline = page.locator(".oline");
      await expect(oline).toHaveCount(0);
    });
  });

  test.describe("When I win the game", () => {
    test("displays the winner: x", async ({ page }) => {
      await app(page).xWins();

      await expect(app(page).winner()).toBeVisible()
      await expect(app(page).winner()).toHaveText("X wins!");
    });

    test("displays the winner: o", async ({ page }) => {
      await app(page).oWins();

      await expect(app(page).winner()).toBeVisible()
      await expect(app(page).winner()).toHaveText("O wins!");
    });

    test("doesn't let me place any more marks", async ({ page }) => {
      await app(page).xWins();

      const text = (await (await app(page).board()).innerText()).replace(/\s+/g, "");
      for (let b = 0; b < 9; ++b) {
        for (let s = 0; s < 9; ++s) {
          await app(page).getSquare(b, s).click();
        }
      }

      const newText = (await (await app(page).board()).innerText()).replace(/\s+/g, "");
      expect(text).toEqual(newText);
    });
  });
});
