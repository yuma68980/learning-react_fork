# chapter-03 マルバツゲームの作成

縦横 3x3 の盤面を持つマルバツゲームを作成してみましょう

## 03-1. コンポーネントの分割

マルバツゲームを作成するにあたって、画面の構成要素をコンポーネントに分割します  

今回は以下の３つに分割してみます  
・ゲーム全体を包括するコンポーネント  
・盤面を構築するコンポーネント  
・◯ or × を表示する枠のコンポーネント  


`src/tictactoe/` 配下に以下のファイルが存在することを確認してください  

・Game.js  
・Board.js  
・Square.js  

レンダリングのツリーとしては以下のような形になります  

```
root
┗App
　┗Game
　　┗Board
　　　┗Square (n)
```


## 03-1. ◯ or × を表示する枠の作成 (Square.js)

ではまず、◯ or × を表示する枠を作成します  

構成要素として必要なものは、以下のような事柄になります  
・押されたかどうか判定する  
・押されたことを通知する  
・どちらの手番で押されたか表示する  

では、コンポーネントを記述してみましょう

```jsx
export default function Square({ value, onSquareClick }) {
  return (
    <div className="square" onClick={onSquareClick}>
      {value}
    </div>
  );
}
```

スタイル (CSS) も合わせて記載しましょう

```css
.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
  cursor: pointer;
}
```

ここで、 `App.js` でコンポーネントを呼び出してみましょう  
枠が1個表示できたらOKです  

```jsx
import Square from './tictactoe/Square';
export default function App() {
    return <Square />;
}
```



## 03-2. ◯ or × を表示する枠の作成 (Board.js)

次に、03-1 で作成した枠を並べて 3x3 の盤面を構築するコンポーネントを作成します  

`Square.js` を読み込み9個並べていきます  
また、各Squareコンポーネントに対して、値や押されたときの挙動に関する処理を設定していきます  

では、コンポーネントを記述してみましょう  

```jsx
import Square from './Square';

export default function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

スタイル (CSS) も合わせて記載しましょう

```css
.status {
  margin-bottom: 10px;
}
.board-row:after {
    clear: both;
    content: '';
    display: table;
}
```


## 03-3. ゲーム全体を包括するコンポーネントの作成 (Game.js)

03-2 で盤面が作成できました 
ではその盤面の操作に対して、ゲーム全体の挙動を把握・操作するコンポーネントを作成しましょう

```jsx
import { useState } from 'react';
import Board from './Board';

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
```

スタイル (CSS) も合わせて記載しましょう

```css
.game {
  display: flex;
  flex-direction: row;
}
.game-info {
  margin-left: 20px;
}
```

## 03-4. マルバツゲームの開始

`App.js` で `Game` コンポーネントを呼び出してみましょう  

```jsx
import Game from './tictactoe/Game';
export default function App() {
    return <Game />;
}
```


## 03-5. おまけ

暇な人は以下の仕様を追加してみましょう

・勝敗の記録を付け、勝率などを表示する
・盤面のリセット（履歴も含めてリセットする）
・リーチしているときに盤面の色を変える