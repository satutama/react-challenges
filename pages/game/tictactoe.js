import Link from "next/link";
import { useState } from "react";
import styles from "./tictactoe.module.css";

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function Square({ value, onSquareClick }) {
  return (
    <button className={styles.square} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  let winLine = null;

  if (winner) {
    status = "Winner: " + winner;
    winLine = calculateWinningLine(squares);
  } else if (squares.every((square) => square !== null)) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const boardSize = 3;
  const boardRows = [];
  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      const squareIndex = i * boardSize + j;
      const isWinningSquare = winLine && winLine.includes(squareIndex);

      row.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
          isWinningSquare={isWinningSquare}
        />
      );
    }

    boardRows.push(
      <div key={i} className={styles.board_row}>
        {row}
      </div>
    );
  }

  return (
    <>
      <div className={styles.status}>{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const [isAscending, setIsAscending] = useState(true);

  function handleToggleSort() {
    setIsAscending(!isAscending);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const sortedHistory = isAscending ? history : [...history].reverse();

  const moves = sortedHistory.map((squares, move) => {
    const reversedMove = isAscending ? move : history.length - 1 - move;
    let description;
    if (reversedMove > 0) {
      description = "Go to move #" + reversedMove;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={reversedMove}>
        <button onClick={() => jumpTo(reversedMove)}>{description}</button>
      </li>
    );
  });

  return (
    <div>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>

      <div className={styles.game}>
        <div className={styles.game_board}>
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
        <div className={styles.game_info}>
          <button onClick={handleToggleSort}>
            Toggle Sort Order: {isAscending ? "Ascending" : "Descending"}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculateWinningLine(squares) {
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return WINNING_LINES[i];
    }
  }
  return null;
}
