var app = require('./appHelper.js');

describe("Acceptance tests", function () {

    beforeEach(function () {
        browser.get("/");
    })

    describe("When I view the app", function () {

        it("displays the title in the browser", function () {
            var title = browser.getTitle().then((text) => text);
            expect(title).toBe("Tic Metac Toe");
        })

        it("shows credit in the footer", function () {
            expect(app.footer.isDisplayed()).toBe(true);
            expect(app.footer.getText()).toContain("Coded by Steve Zelek using React");
        });

        it("shows the title of the app", function () {
            expect(app.title.isDisplayed()).toBe(true);
            expect(app.title.getText()).toContain("Tic Metac Toe");
        })

        it("shows a blank board", function () {
            expect(app.board.isDisplayed()).toBe(true);
            expect(app.board.getText()).toEqual("");
        })

        it("shows a new game button", function () {
            expect(app.newGame.isDisplayed()).toBe(true);
            expect(app.newGame.getText()).toEqual("new game?")
        })

        it("does not show a winner", function () {
            expect(app.winner.isDisplayed()).toBe(false);
        })
    });

    describe("When I play in squares", function () {

        it("lets me place a marker", function () {
            var square = app.getSquare(0, 0);
            square.click();
            expect(square.getText()).toEqual("x");

        })

        it("lets me take turns", function () {
            var xsquare = app.getSquare(0, 0);
            xsquare.click();
            expect(xsquare.getText()).toEqual("x");

            var osquare = app.getSquare(0, 1);
            osquare.click();
            expect(osquare.getText()).toEqual("o");
        })

        for (let i = 0; i < 9; ++i) {
            it(`if I play in square ${i} I can't play outside board ${i}`, function () {
                app.getSquare(0, i).click();
                for (let b = 0; b < 9; ++b) {
                    if (b === i) continue;
                    for (let s = 0; s < 9; ++s) {
                        app.getSquare(b, s).click();
                    }
                }
                expect(app.board.getText()).toEqual("x");
            })
        }

        for (let i = 0; i < 9; ++i) {
            it(`if I play in square ${i} I can play inside board ${i}`, function () {
                for (let s = 0; s < 9; ++s) {
                    if (i === 0 && s === 0) continue;
                    app.getSquare(0, i).click();
                    app.getSquare(i, s).click();
                    let text = app.board.getText().then((text) => text.replace(/\s+/g, ""))
                    expect(text).toEqual("xo");
                    browser.get("/");
                }
            })
        }

        it("if I play in a square, the matching board is highlighted", function () {
            for (let i = 0; i < 9; ++i) {
                app.getSquare(0, i).click();
                var miniBoard = app.getBoard(i);
                expect(miniBoard.getAttribute("class")).toContain("currentBoard");
                browser.get("/");
            }
        })

        it("if I've played in squares, I can reset the game", function () {
            for (var i = 0; i < 9; ++i) {
                app.getSquare(i, (i + 1) % 9).click();
            }
            let length = app.board.getText().then((text) => text.replace(/\s+/g, "").length)
            expect(length).toBeGreaterThan(0);

            app.newGame.click();
            text = app.board.getText().then((text) => text.replace(/\s+/g, ""))
            expect(text).toBe("");
        })

        it("if I play in a square, it cannot be played in again", function () {
            var square = app.getSquare(0, 0);
            square.click();
            expect(square.getText()).toBe("x");

            square.click();
            expect(square.getText()).toBe("x");
        })

        it("if a board is full, I can play anywhere", function () {
            for (var i = 1; i < 9; ++i) {
                app.getSquare(0, 0).click();
                app.getSquare(0, 1).click();
                app.getSquare(1, 0).click();
                app.getSquare(0, 2).click();
                app.getSquare(2, 0).click();
                app.getSquare(0, 3).click();
                app.getSquare(3, 0).click();
                app.getSquare(0, 4).click();
                app.getSquare(4, 0).click();
                app.getSquare(0, 5).click();
                app.getSquare(5, 0).click();
                app.getSquare(0, 6).click();
                app.getSquare(6, 0).click();
                app.getSquare(0, 7).click();
                app.getSquare(7, 0).click();
                app.getSquare(0, 8).click();
                app.getSquare(8, 0).click();

                let length = app.board.getText().then((text) => text.replace(/\s+/g, "").length)
                app.getSquare(i, 1).click();

                let newLength = app.board.getText().then((text) => text.replace(/\s+/g, "").length)
                expect(newLength).toBeGreaterThan(length);

                browser.get("/");
            }

        })
    })


    describe("When I win a board", function () {

        beforeEach(function () {
            app.getSquare(4, 0).click();
            app.getSquare(0, 4).click();
            app.getSquare(4, 1).click();
            app.getSquare(1, 4).click();
            app.getSquare(4, 2).click();
        })

        it("I get a line", function () {
            var line = element(by.css(".xline"));
            expect(line.isPresent()).toBe(true);
        })

        it("I can reset it", function () {
            var line = element(by.css(".xline"));
            expect(line.isPresent()).toBe(true);

            let numMarks = app.board.getText().then((text) => text.replace(/\s+/g, "").length)
            expect(numMarks).toBeGreaterThan(0);

            app.newGame.click();
            text = app.board.getText().then((text) => text.replace(/\s+/g, ""))
            expect(text).toBe("");
            expect(line.isPresent()).toBe(false);
        })

        it("I can't get another line in that board", function () {
            app.getSquare(2, 2).click();
            app.getSquare(2, 4).click();
            app.getSquare(4, 3).click();
            app.getSquare(3, 4).click();
            app.getSquare(4, 5).click();
            app.getSquare(5, 4).click();
            app.getSquare(4, 4).click();

            var xline = element(by.css(".xline"));
            expect(xline.isPresent()).toBe(true);

            var oline = element(by.css(".oline"));
            expect(oline.isPresent()).toBe(false);
        })
    })
    describe("When I win the game", function () {

        it("displays the winner: x", function () {
            app.xWins();
            expect(app.winner.isDisplayed()).toBe(true);
            expect(app.winner.getText()).toContain("X wins");
        })

        it("displays the winner: o", function () {
            app.oWins();
            expect(app.winner.isDisplayed()).toBe(true);
            expect(app.winner.getText()).toContain("O wins");
        })

        it("doesn't let me place any more marks", function () {
            app.xWins();
            var text = app.board.getText((text) => text);
            for (var b = 0; b < 9; ++b) {
                for (var s = 0; s < 9; ++s) {
                    app.getSquare(b, s).click();
                }
            }
            var newText = app.board.getText((text) => text);
            expect(text).toEqual(newText);
        })

        it("I can reset the game", function () {
            app.xWins();
            var line = element(by.css(".xline"));
            expect(line.isPresent()).toBe(true);
            let numMarks = app.board.getText().then((text) => text.replace(/\s+/g, "").length)
            expect(numMarks).toBeGreaterThan(0);
            var boardMarks = element(by.css(".winningBoard"));
            expect(boardMarks.isPresent()).toBe(true);

            app.newGame.click();
            let text = app.board.getText().then((text) => text.replace(/\s+/g, ""))
            expect(text).toBe("");
            expect(line.isPresent()).toBe(false);
            expect(boardMarks.isPresent()).toBe(false);
        })
    })
});