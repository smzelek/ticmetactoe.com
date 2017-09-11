describe('Acceptance tests', function () {

    beforeAll(function () {
        browser.get('/');
    })

    describe('When I view the app', function () {

        it('shows credit in the footer', function () {
            var footer = element(by.css('#footer'));
            expect(footer.isDisplayed()).toBe(true);
            expect(footer.getText()).toContain('Coded by Steve Zelek using React');
        });

        it('shows the title of the app', function () {
            var title = element(by.css('#game h2'));
            expect(title.isDisplayed()).toBe(true);
            expect(title.getText()).toContain('Tic Metac Toe');
        })

        it('shows a blank board', function () {
            var board = element(by.css('#board'));
            expect(board.isDisplayed()).toBe(true);
            expect(board.getText()).toEqual('');
        })

        it('shows a new game button', function () {
            var newgame = element(by.css('#new-game'));
            expect(newgame.isDisplayed()).toBe(true);
            expect(newgame.getText()).toEqual('new game?')
        })
    });

    describe('When I play the game', function () {
        beforeEach(function () {
            browser.get('/');
        })
        it('lets me place a marker', function () {
            var square = $$('.square').get(0);
            square.click();
            expect(square.getText()).toEqual('x');

        })

        it('lets me take turns', function () {
            var xsquare = $$('.square').get(0);
            xsquare.click();
            expect(xsquare.getText()).toEqual('x');

            var osquare = $$('.square').get(1);
            osquare.click();
            expect(osquare.getText()).toEqual('o');
        })

        for (let i = 0; i < 9; ++i) {
            it(`when I play in square ${i} I can't play outside board ${i}`, function () {
                var board = element(by.css('#board'));
                $$('.square').get(i).click();
                for (let b = 0; b < 9; ++b) {
                    if (b === i) continue;
                    for (let s = 0; s < 9; ++s) {
                        $$('.square').get(9 * b + s).click();
                    }
                }
                expect(board.getText()).toEqual('x');
            })
        }
        for (let i = 0; i < 9; ++i) {
            it(`when I play in square ${i} I can play inside board ${i}`, function () {
                var board = element(by.css('#board'));
                //should check that all valid squares all clickable
                $$('.square').get(i).click();
                $$('.square').get(i*9+1).click();
                let text = board.getText().then((text) => text.replace(/\s+/g, ''))
                expect(text).toEqual('xo');
            })
        }


    })

});