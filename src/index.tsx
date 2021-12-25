import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import "./index.css";

const height = 20;
const width = 30;

interface TyCell {
  alive: boolean,
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

const Cell: React.FC<TyCell> = props => {
  const color = props.alive ? "black" : "white";
  return (
    <button className="cell" style={{ backgroundColor: color }} onClick={props.onClick} />
  );
}

interface TyTable {
  lives: boolean[][],
  handleCellClick: (i: number, j: number) => React.MouseEventHandler<HTMLButtonElement>
}

const Table: React.FC<TyTable> = props => {
  return (
    <div>
      {props.lives.map((row, i) => (
        <div className="board-row">
          {row.map((life, j) => <Cell alive={life} onClick={props.handleCellClick(i, j)} key={`${i}${j}`} />)}
        </div>
      ))}
    </div>
  )
}

const App: React.FC = _ => {
  const emptyLists: boolean[][] = Array(height).fill(Array(width).fill(false));
  const [lives, setLives] = useState(emptyLists);
  const [progress, setProgress] = useState(true);
  document.title = "Game of Life"
  // calculate the next board
  const calcNewBoard = (oldBoard: boolean[][]) => {
    // decide whether the cell is alive in the next step
    const willAlive = (i: number, j: number) => {
      let count = 0;
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) continue;
          let ni = i + di;
          let nj = j + dj;
          if (ni >= 0 && nj >= 0 && ni < height && nj < width && oldBoard[ni][nj]) count++;
        }
      }

      if (oldBoard[i][j]) {
        return count === 2 || count === 3; // if the cell is alive
      } else {
        return count === 3; // if the cell is dead
      }
    }
    return oldBoard.map((row, i) => row.map((_, j) => willAlive(i, j)));
  }

  const handleCellClick = (i: number, j: number) => () => {
    let newLives = lives.map(row => [...row])
    newLives[i][j] = !newLives[i][j]
    console.log(`${i} ${j}`);
    setLives(newLives);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress) {
        setLives(calcNewBoard(lives))
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lives, progress])

  return (
    <>
      <h1>ライフゲーム</h1>
      <button onClick={() => setLives(emptyLists)}>リセット</button>
      <button onClick={() => setProgress(!progress)}>{progress ? "時間を止める" : "時間を進める"}</button>
      <Table lives={lives} handleCellClick={handleCellClick} />
    </>
  )
}


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
