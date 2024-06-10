# chapter-05 state の振る舞い

chapter-04 にて登場した state 変数は、あたかも読み書きができる普通の JavaScript の変数のように見えます  
しかし、state 自体は更新されておらず、その瞬間の値を保持したスナップショットのように振る舞います  

state のセッターを用いて更新しているように思えまずが、既にある state 変数は変更されず、代わりに再レンダーがトリガされます  


## 05-1. レンダーがトリガされる

UIとは、クリックなどのユーザイベントに直接反応して更新されるもの……という考え方は React の動作とは異なります  

前章で、state のセッターに値を渡すことで `再レンダーを React に要求している` ことに触れました  
これは、インターフェースがイベントに応答するために state を更新する必要があることを意味します  

以下のサンプルソースを **App.js** に記載し、 `npm run start` で実行してみましょう  

``` js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way! : {message}</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // 何もしない
}
```


「Send」ボタンをクリックすると `setIsSent(true)` が実行されることで React に UI の再レンダーを指示しています  

ボタンをクリックしたときの処理の流れは以下のようになります  

1. `button type="submit"` のボタンがクリックされたため、`onSubmit` イベントハンドラが実行されます  
2. `setIsSent(true)` が `isSent` を true にセットし、新しいレンダーを予約します  
3. React が新しい `isSent` の値を使ってコンポーネントを再レンダーします  


## 05-2. 「レンダーする」とはなにか

新しいレンダー、再レンダーなどとありますが、そもそも「レンダーする」とはなにを指すのでしょうか  

React においては、React があなたのコンポーネント（関数）を呼び出し、結果となる JSX を関数から返してもらうことを指します  
その JSX 内の props、イベントハンドラ、ローカル変数はすべて、**レンダー時の state を使用して計算されます**  

つまり、React がコンポーネントを再レンダーする際の処理は以下のようになります  

1. React が再度あなたのコンポーネント（関数）を呼び出します
2. 関数は新しい JSX のスナップショットを返します
3. React は関数が返したスナップショットに合わせて画面を更新します


## 05-3. state の更新

コンポーネント内で利用した state は、関数が終了したら消えてしまう通常の変数とは異なります  
実際には React 自体の中で「生存」しており、関数の外部で存在し続けます  

React がコンポーネントを呼び出すとき、React はその特定のレンダーに対する `state のスナップショット` を提供します  
コンポーネントは、props やイベントハンドラの新たな一式を揃えた JSX という形で `UI のスナップショット` を返します  

ここで、これらがどのように動作するかを示すサンプルを見てみます  
以下のサンプルソースを **App.js** に記載し、 `npm run start` で実行してみましょう  

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

「＋３」ボタンの中では、`setNumber(number + 1)` が3回実行されています  
`number` の値も当然3ずつ増加していきそうですが……そうはなりません  
`number` はボタンのクリックごとに `1` ずつ増加するはずです  

これは、 state をセットしても、それが本当に変更されるのは次回のレンダーであるためです  
最初のレンダーでは `number` が 0 であり、そのレンダーの `onClick` ハンドラにおいては、常に `number` が 0 であり続けるのです  
`setNumber(number + 1)` で再レンダー後、つまり `number` が 1 となった後も同様に、そのレンダー状態では `number` の値は保持されます  

再度になりますが、state のセッターは `再レンダーを React に要求している` ものになります  
そのため、次のレンダーで `number + 1` での更新を3回要求しているに過ぎず、値そのものは更新されていないのです  


わかりやすく変数の値を実数値にしてみると以下のようになります  
```jsx
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

`0 + 1` で再レンダー後は、以下のようになります
```jsx
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```


## 05-4. 時間経過と state

再レンダーされるまで値が変わらないことが確認できました  
ここで、タイマーを設定してコンポーネントが再レンダーされた後に処理を実行するとどうなるでしょうか  

以下のサンプルソースを **App.js** に記載し、 `npm run start` で実行してみましょう  

ボタンをクリックし3秒後に、`number` の値がアラートに表示されます  
"0" と表示されるのか、"5" と表示されるのか推測してみてください  

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

前回のレンダーで利用された値がアラートに表示されるはずです  

ここで、実数値に置き換えてみると以下のようになります  
```jsx
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

アラートが実行される時点 (ボタンが押されて3秒後) には React に格納されている state は既に更新されているかもしれません  
しかし、アラートのスケジューリングはユーザがボタンを操作した時点での state のスナップショットを使って行われているのです  

イベントハンドラのコードが非同期であっても、同一レンダー内の state 変数の値は決して変わりません  
そのレンダーの `onClick` 内では、`setNumber(number + 5)` が呼ばれた後も number の値は 0 のままです  
その値は React があなたのコンポーネントを呼び出して `UI のスナップショットを取った` 時に、「固定」されていると言うことです  

React はレンダー内の state の値を「固定」し、イベントハンドラ内で保持するため、  
一連の処理が完了するまで変更がないようにブロックする…動作を止める…などといった心配は無用になります  


## 05-5. まとめ

- state のセットは再レンダーを React に要求する
- React は state をコンポーネントの外側で保持している
- useState を呼び出すと、React はそのレンダーのための state のスナップショットを返す
- 変数やイベントハンドラは複数レンダーをまたいで「生き残る」ことはなく、すべてのレンダーは固有のイベントハンドラを持つ
- 各レンダー（およびその中の関数）からは、常に、React が そのレンダーに渡した state のスナップショットが見える
- 過去に作成されたイベントハンドラは、それが作成されたレンダーにおける state の値を持っている

## 05-ex. ひまなやつ向け

再レンダー前に最新の state を読み取りたい場合もあるかと思います  
そんなときには state 更新を `関数` で行うことができます  

一般的なユースケースではありませんが、次のレンダー前に同じ state 変数を複数回更新する場合、  
`setNumber(number + 1)` のようにして次の state 値を渡すのではなく、  
代わりに `setNumber(n => n + 1)` のようなキュー内のひとつ前の state に基づいて次の state を計算する `関数を渡す` ことができます  
これは、state の値を単に置き換えるのではなく、代わりに React に「その state の値に対してこのようにせよ」と伝えるための手段です

以下のサンプルソースを **App.js** に記載し、 `npm run start` で実行してみましょう  
ボタンをクリックすると 3ずつカウントが増えるはずです

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

この関数は `更新用関数 (updater function)` と呼ばれます  
