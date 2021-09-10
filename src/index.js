import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      this.props.isHighlighted ?
        <button className="square"
          style={{ color: "red" }}
          onClick={() => this.props.onClick()}>
          {this.props.value}
        </button>
        :
        <button className="square"
          onClick={() => this.props.onClick()}>
          {this.props.value}
        </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      isHighlighted={this.props.highlightedSquares.includes(i)}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <div>
        {
          [0, 1, 2].map(r =>
            <div className="board-row" key={r}>
              {[0, 1, 2].map(c => <span key={c}>{this.renderSquare(3 * r + c)}</span>)}
            </div>
          )
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squareHistory: [{
        squares: Array(9).fill(null),
      }],
      posHistory: [],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const squareHistory = this.state.squareHistory.slice(0, this.state.stepNumber + 1);
    const current = squareHistory[squareHistory.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)[0] || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const posHistory = this.state.posHistory.slice(0, this.state.stepNumber);
    this.setState({
      squareHistory: squareHistory.concat([{
        squares: squares,
      }]),
      posHistory: posHistory.concat([{
        player: this.state.xIsNext ? 'X' : 'O',
        x: Math.floor(i / 3) + 1,
        y: i % 3 + 1,
      }]),
      stepNumber: squareHistory.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const squareHistory = this.state.squareHistory;
    const current = squareHistory[this.state.stepNumber];
    const winResult = calculateWinner(current.squares);
    const winner = winResult[0];
    const posHistory = this.state.posHistory;
    const moves = squareHistory.map((step, move) => {
      const desc = move ? `move #${move} player:${posHistory[move - 1].player} pos:(${posHistory[move - 1].x}, ${posHistory[move - 1].y})` : 'game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move == this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) status = 'Winner: ' + winner;
    else {
      if (this.state.stepNumber == 9) status = 'End in a tie'
      else status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            highlightedSquares={[winResult[1], winResult[2], winResult[3]]}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

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
    if (squares[a] && squares[a] == squares[b] && squares[b] == squares[c]) {
      return [squares[a], a, b, c];
    }
  }
  return [null];
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
