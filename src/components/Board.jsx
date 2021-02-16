import React from 'react';
import './Board.scss';
import Square from './Square.jsx';

class Board extends React.Component {
    render() {
      const board = Array(3).fill(null).map((v, i) => {
        const row = Array(3).fill(null).map((v, j) => {
          const squareNum = i * 3 + j;
          return <Square
            key={`square ${(this.props.boardNum * 9) + squareNum}`}
            registerSquare={(el) => this.props.registerSquare(squareNum, el)}
            squareNum={squareNum}
            value={this.props.boardValue[squareNum]}
            onClick={() => this.props.onClick(squareNum)} />;
        });
        return (
          <div key={`minirow ${this.props.boardNum * 4 + i}`}>
            {row}
            <div className="row"></div>
          </div>
        );
      });
  
      var wonBoard = '';
  
      if (this.props.gameWinningLine !== null && this.props.gameWinningLine.includes(this.props.boardNum)) {
  
        var boardWinner = this.props.gameWinner === 'x' ? 'xboard' : 'oboard';
        var classes = `winningBoard ${boardWinner}`
  
        wonBoard = (
          <div className={classes}>
            {this.props.gameWinner.toUpperCase()}
          </div>
        );
      }
  
      var top = this.props.boardNum === 1 ? 'top ' : '';
      var left = this.props.boardNum === 3 ? 'left ' : '';
      var middle = this.props.boardNum === 4 ? 'middle ' : '';
      var right = this.props.boardNum === 5 ? 'right ' : '';
      var bottom = this.props.boardNum === 7 ? 'bottom ' : '';
  
      var noCurrent = this.props.noCurrent ? 'noCurrent ' : '';
      var current = this.props.isCurrent ? 'currentBoard ' : '';
      var classes = `board ${current}${noCurrent}${top}${left}${middle}${right}${bottom}`
  
      return (
        <div className={classes}>
          {wonBoard}
          {board}
        </div>
      );
    }
  }

export default Board;
