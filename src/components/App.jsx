import React from 'react';
import Footer from './Footer.jsx'
import './App.scss';

//draw game winning line on board?
//add rules button
//make look niceee

class Square extends React.Component {
  render() {
    var xsquare = this.props.value === 'x' ? 'xsquare' : '';
    var osquare = this.props.value === 'o' ? 'osquare' : '';

    var top = this.props.squareNum === 1 ? 'top' : '';
    var left = this.props.squareNum === 3 ? 'left' : '';
    var middle = this.props.squareNum === 4 ? 'middle' : '';
    var right = this.props.squareNum === 5 ? 'right' : '';
    var bottom = this.props.squareNum === 7 ? 'bottom' : '';
    var classes = `square ${xsquare} ${osquare} ${top} ${left} ${middle} ${right} ${bottom}`

    return (
      <button
        ref={el => this.props.registerSquare(el)}
        className={classes}
        onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

class MiniBoard extends React.Component {
  render() {
    const board = Array(3).fill(null).map((v, i) => {
      const row = Array(3).fill(null).map((v, j) => {
        const squareNum = i * 3 + j;
        return <Square
          registerSquare={(el) => this.props.registerSquare(squareNum, el)}
          squareNum={squareNum}
          value={this.props.boardValue[squareNum]}
          onClick={() => this.props.onClick(squareNum)} />;
      });
      return (
        <div>
          {row}
          <div className="row"></div>
        </div>
      );
    });

    var top = this.props.boardNum === 1 ? 'top' : '';
    var left = this.props.boardNum === 3 ? 'left' : '';
    var middle = this.props.boardNum === 4 ? 'middle' : '';
    var right = this.props.boardNum === 5 ? 'right' : '';
    var bottom = this.props.boardNum === 7 ? 'bottom' : '';

    var current = this.props.isCurrent ? 'currentBoard' : '';
    var classes = `board ${current} ${top} ${left} ${middle} ${right} ${bottom}`

    return (
      <div className={classes}>
        {board}
      </div>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xIsNext: true,
      currentBoard: null,
      miniBoards: Array(9).fill(Array(9).fill(null)),
      miniBoardWinners: Array(9).fill({ winner: null, winningLine: null }),
      winner: null,
      winningLine: null,
      lines:
      [[0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]]
    }
    this.squareElements = Array(9).fill(Array(9).fill(null));
  }

  newGame() {
    this.setState({
      xIsNext: true,
      currentBoard: null,
      miniBoards: Array(9).fill(Array(9).fill(null)),
      miniBoardWinners: Array(9).fill({ winner: null, winningLine: null }),
      winner: null,
      winningLine: null
    })
  }

  isFull(miniBoard) {
    for (var i = 0; i <= 8; ++i) {
      if (miniBoard[i] === null) {
        return false;
      }
    }
    return true;
  }

  didWinMiniBoard(miniBoard, player) {
    for (var i = 0; i < this.state.lines.length; ++i) {
      for (var j = 0; j <= 2; ++j) {
        if (miniBoard[this.state.lines[i][j]] !== player) {
          break;
        }
        if (j === 2) {
          return this.state.lines[i];
        }
      }
    }
    return null;
  }

  didWin(miniBoardWinners, player) {
    for (var i = 0; i < this.state.lines.length; ++i) {
      for (var j = 0; j <= 2; ++j) {
        if (miniBoardWinners[this.state.lines[i][j]].winner !== player) {
          break;
        }
        if (j === 2) {
          return this.state.lines[i];
        }
      }
    }
    return null;
  }

  registerSquare(b, i, el) {
    let squareElements = this.squareElements.map(a => Object.assign({}, a));
    squareElements[b][i] = el;
    this.squareElements = squareElements;
  }

  handleClick(b, i) {
    if (this.state.winner)
      return;
    if (this.state.currentBoard !== null && b !== this.state.currentBoard)
      return;
    if (this.state.miniBoards[b][i])
      return;

    const player = this.state.xIsNext ? 'x' : 'o';
    const miniBoards = this.state.miniBoards.map(a => Object.assign({}, a));
    miniBoards[b][i] = player;

    let miniBoardWinners = this.state.miniBoardWinners;
    let winner = null;
    let gameWinningLine = null;
    if (!miniBoardWinners[b].winner) {
      const boardWinningLine = this.didWinMiniBoard(miniBoards[b], player);
      if (boardWinningLine) {
        miniBoardWinners[b] = { winner: player, winningLine: boardWinningLine };
        gameWinningLine = this.didWin(miniBoardWinners, player);
        if (gameWinningLine) {
          winner = player;
        }
      }
    }

    let currentBoard = i;
    if (winner || this.isFull(miniBoards[i])) {
      currentBoard = null;
    }

    this.setState({
      winner: winner,
      winningLine: gameWinningLine,
      miniBoards: miniBoards,
      currentBoard: currentBoard,
      xIsNext: !this.state.xIsNext,
      miniBoardWinners: miniBoardWinners
    })
  }

  resize() {
    this.forceUpdate()
  }

  componentWillMount() {
    this.resize();
  }
  componentDidMount() {
    window.addEventListener("resize", this.resize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  render() {
    const board = Array(3).fill(null).map((v, r) => {
      const row = Array(3).fill(null).map((v, c) => {
        const boardNum = r * 3 + c;
        let isCurrent = false;
        if (boardNum === this.state.currentBoard)
          isCurrent = true;
        return <MiniBoard
          boardWinner={this.state.miniBoardWinners[boardNum]}
          isCurrent={isCurrent}
          boardNum={boardNum}
          boardValue={this.state.miniBoards[boardNum]}
          onClick={(i) => this.handleClick(boardNum, i)}
          registerSquare={(i, el) => this.registerSquare(boardNum, i, el)} />;
      });
      return (
        <div>
          {row}
          <div className="row"></div>
        </div>
      );
    });

    const winLines = this.state.miniBoardWinners.map((v, i) => {
      if (v.winner !== null) {
        var firstSquare = this.squareElements[i][v.winningLine[0]];
        var lastSquare = this.squareElements[i][v.winningLine[2]];
        var x1 = firstSquare.offsetLeft + firstSquare.offsetWidth / 2;
        var y1 = firstSquare.offsetTop + firstSquare.offsetHeight / 2;
        var x2 = lastSquare.offsetLeft + lastSquare.offsetWidth / 2;
        var y2 = lastSquare.offsetTop + lastSquare.offsetHeight / 2;

        var winner = v.winner === 'x' ? 'xline' : 'oline';
        var classes = `${winner}`

        return <line
          className={classes}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2} />
      }
      return null;
    })

    const winningClass = this.state.winner === 'x' ? 'xwins' : 'owins';

    const winner = (
      <div hidden={this.state.winner === null} id="winner" className={winningClass}>
        {this.state.winner === 'x' ? 'X' : 'O'} wins!
          <br />
        {this.state.winner === 'x' ? 'O' : 'X'} = ☹
        </div>
    )
    return (
      <div id="container">
        <div id="app">
          <div id="game">
            <h2>Tic Metac Toe</h2>
            <div id="board">{board}</div>
            <svg>{winLines}</svg>
            <button id="new-game" onClick={() => this.newGame()}>new game?</button>
            {winner}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Board;