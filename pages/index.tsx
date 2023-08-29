import { useState } from "react";
import styles from "./index.module.scss";

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

interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
}

function Square({ value, onSquareClick }: SquareProps) {
  const classNames = `${styles.square} ${value === 'X' ? styles.xColor : ''} ${value === 'O' ? styles.oColor : ''}`;

  return (
    <button className={classNames} onClick={onSquareClick}>
      {value}
    </button>
  );
}

interface BoardProps {
  xIsNext: boolean;
  squares: Array<string | null>;
  onPlay: (nextSquares: Array<string | null>) => void;
}

function Board({ xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  let winLine = null;

  if (winner) {
    status = "Winner: " + winner;
    winLine = calculateWinningLine(squares);
  } else if (squares.every((square) => square !== null)) {
    status = "It's a draw! Try again";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const boardSize = 3;
  const boardRows = [];
  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      const squareIndex = i * boardSize + j;

      row.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
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
  const [history, setHistory] = useState<Array<Array<string | null>>>([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const [isAscending, setIsAscending] = useState<boolean>(true);

  function handleToggleSort() {
    setIsAscending(!isAscending);
  }

  function handlePlay(nextSquares: Array<string | null>) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const sortedHistory = isAscending ? history : [...history].reverse();

  const moves = sortedHistory.map((squares, move) => {
    const reversedMove = isAscending
      ? move
      : history.length - 1 - move;
    const description =
      reversedMove > 0
        ? "Go to move #" + reversedMove
        : "Go to game start";
    return (
      <li key={reversedMove}>
        <button onClick={() => jumpTo(reversedMove)}>{description}</button>
      </li>
    );
  });

  return (
    <div className={styles.game}>
      <div className={styles.game_board}>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className={styles.game_info}>
        <button onClick={handleToggleSort}>
          Toggle Sort Order: {isAscending ? "Ascending" : "Descending"}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares: Array<string | null>): string | null {
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

function calculateWinningLine(squares: Array<string | null>): Array<number> | null {
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return WINNING_LINES[i];
    }
  }
  return null;
}
