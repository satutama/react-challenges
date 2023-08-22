import Link from "next/link";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">
          <Link href="/game/tictactoe">Tic tac toe</Link>
        </h1>
      </header>
    </div>
  );
}

export default App;
