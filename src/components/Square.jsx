import React from 'react';
import './Square.scss';

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

export default Square;
