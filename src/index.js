import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  const value = (props.hilighted) ? <mark>{props.value}</mark> : props.value;
  return (
    <button className="square" onClick={props.onClick}>
      {value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      hilighted={this.props.hilighteds.includes(i)}
      key={i}
      value={this.props.squares[i]}
      onClick={() => { this.props.onClick(i); }}
    />;
  }

  render() {
    let board_rows = [];
    for (let y = 0; y < 3; y++) {
      let squares = [];
      for (let x = 0; x < 3; x++) {
        squares.push(this.renderSquare(y * 3 + x));
      }
      board_rows.push(<div className="board-row" key={y}>{squares}</div>);
    }
    return <div>{board_rows}</div>;
    // return (
    //   <div>
    //     <div className="board-row">
    //       {this.renderSquare(0)}
    //       {this.renderSquare(1)}
    //       {this.renderSquare(2)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(3)}
    //       {this.renderSquare(4)}
    //       {this.renderSquare(5)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(6)}
    //       {this.renderSquare(7)}
    //       {this.renderSquare(8)}
    //     </div>
    //   </div>
    // );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        place: -1,
      }],
      XisNext: true,
      stepNumber: 0,
      sortOrder: true,
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }
    squares[i] = this.state.XisNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        place: i,
      }]),
      XisNext: !this.state.XisNext,
      stepNumber: history.length,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      XisNext: (step % 2) === 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares)[0];
    const hilighteds = calculateWinner(current.squares)[1];

    let moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const col = step.place % 3;
      const row = Math.floor(step.place / 3);
      const place = (move !== 0) ? '(' + col + ',' + row + ')' : '';
      const button = (move === this.state.stepNumber) ?
        <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button> :
        <button onClick={() => this.jumpTo(move)}>{desc}</button>
      return (
        <li key={move}>
          {button}
          <div>{place}</div>
        </li>
      );
    });
    if (!this.state.sortOrder) {
      moves = moves.slice(0).reverse();
    }

    let status;
    if (this.state.stepNumber === 9 && !winner) {
      status = 'Draw';
    } else if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.XisNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            hilighteds={hilighteds}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.setState({ sortOrder: !this.state.sortOrder })}>reverse order</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, []];
}