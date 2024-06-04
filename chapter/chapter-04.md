# chapter-04 state

単純に表示を行うだけの責務をもつコンポーネントでは、表示内容を把握しておけばよいですが、  
ものによっては `ユーザ操作` や `データの内容` に応じて画面上の表示内容を変更する必要があります  
いまコンポーネントは **どのような状態か？** を把握する必要があるというわけです  

例えば、  
・フォーム上でタイプすると入力欄が更新される  
・画像カルーセルで「次」をクリックすると表示される画像が変わる  
・「購入」をクリックすると買い物かごに商品が入る  
といったものです  

コンポーネントは、現在の入力値、現在の画像、ショッピングカートの状態といったものを「覚えておく」必要があります  
React では、このようなコンポーネント固有のメモリのことを state と呼びます  

## 04-1. 作成するコンポーネントの確認

ではまず、`src/resources/data.js` ファイルが存在することを確認してください  
以下のように、彫刻の情報がまとまったデータが存在するはずです  

``` js
export const sculptureList = [{
    name: 'Homenaje a la Neurocirugía',
    artist: 'Marta Colvin Andrade',
    description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
    url: 'https://i.imgur.com/Mx7dA2Y.jpg',
    alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
  }, {
.
.
.
```

このデータをもとに、  
・1件1件の内容を表示する  
・ボタン操作に応じて内容を変化させる  
といった動作をするコンポーネントを作成していきます  


## 04-2. 通常の変数を用いて表示させてみる

ではまず、`data.js` を読み込み、表示させてみましょう

`Gallery.js` を以下のように編集します

```jsx
import { sculptureList } from "./resources/data.js";

export default function Gallery() {
  let index = 0;

  function handleClick() {
    index = index + 1;
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>Next</button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <img src={sculpture.url} alt={sculpture.alt} />
      <p>{sculpture.description}</p>
    </>
  );
}
```

次に、Galleryコンポーネントを `index.js` で読み込みます

```js
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import Gallery from "./Gallery";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Gallery />
  </StrictMode>
);
```

ターミナルで learning-react ディレクトリ を開き、 `npm run start` を実行します  
彫刻データの1件目、「Homenaje a la Neurocirugía」が表示されていればOKです  

ここで、「Next」ボタンの動作について注目してみましょう  
`onClick` でクリック時の挙動が定義されており、その内容は以下のようになっています  

```js
  function handleClick() {
    index = index + 1;
  }
```

変数 index は data.js から読み込んだ配列 sculptureList へアクセスする添字となっています  
それをもとに彫刻データの1件を取得し、表示させているわけです  
つまり、「Next」ボタンをクリックすると、index が 1、2 のように変わりながら次の彫刻が表示されて欲しいのですが、これは **正しく動作しません**



`handleClick` イベントハンドラは、ローカル変数 index を更新しています。しかし、以下の理由により、目に見える変化が起きません  

```
1. ローカル変数はレンダー間で保持されません
   React がこのコンポーネントを次にレンダーするときは、まっさらな状態からレンダーします
   過去にローカル変数を変更したことは考慮されません
2. ローカル変数の変更は、レンダーをトリガしません
   新しいデータでコンポーネントを再度レンダーする必要があることに React は気づきません
```

コンポーネントを新しいデータで更新するためには、次のことが必要です  
これらの機能を `useState` フックが提供してくれます  

```
1. レンダー間でデータを保持する
2. 新しいデータでコンポーネントをレンダー（つまり再レンダー）するよう React に伝える
```



## 04-3. state 変数の追加 (useState フック)

useState フックは、以下の2つの機能を提供します

```
1. レンダー間でデータを保持する state 変数
2. 変数を更新し、React がコンポーネントを再度レンダーするようにトリガする state セッタ関数
```

では先程のソース (Gallery.js) に state 変数を追加してみましょう

```jsx
import { sculptureList } from "./resources/data.js";
import { useState } from 'react';  // 追加

export default function Gallery() {
  const [index, setIndex] = useState(0);  // 編集

  function handleClick() {
    setIndex(index + 1);  // 編集
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>Next</button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <img src={sculpture.url} alt={sculpture.alt} />
      <p>{sculpture.description}</p>
    </>
  );
}
```

state 変数を追加するには、ファイルの先頭で React から useState をインポートする必要があります  
このコンポーネントでは useState フックを利用すると宣言する必要があるというわけです  

```js
import { useState } from 'react';
```

インポートした useState をもとに state 変数を宣言します  
index は state 変数であり、setIndex はセッタ関数です  
useState に渡している `0` は変数の初期値になります  

```js
const [index, setIndex] = useState(0);
```

handleClick ハンドラ内では state 変数のセッタを呼び出しています  
この関数を利用することで、React に state が変更されたことを通知し、再レンダリングが行われるわけです  

```js
function handleClick() {
  setIndex(index + 1);
}
```




## 04-4. 複数の state 変数を使う

1 つのコンポーネントは、いくつでも好きな型の state 変数を持つことができます  
「Show details」 をクリックすると切り替わる真偽値型の showMore という、2 つの state 変数を追加してみましょう  


```jsx
import { sculptureList } from "./resources/data.js";
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);  // 追加

  function handleNextClick() { // 関数名を編集
    setIndex(index + 1);
  }

  function handleMoreClick() { // 追加
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  // テンプレートを編集
  return (
    <>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        by {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img src={sculpture.url} alt={sculpture.alt}/>
    </>
  );
}
```

例の `index` と `showMore` のように state が互いに関連していない場合、複数の state 変数を持つのが良いでしょう  
ただし、2つの state 変数を一緒に更新することが多い場合は、  それらを 1 つにまとめる方が簡単かもしれません  
たとえば、多くのフィールドがあるフォームの場合、フィールドごとに state 変数を持つよりも、オブジェクトを保持する 1 つの state 変数を持つ方が便利です  

オブジェクトを保持する state 変数を利用する場合、オブジェクトの中身を直接操作してはいけません  
オブジェクト自体をセッタ関数にわたす必要があるので注意しましょう  

```js
  const [obj, setObj] = useState({
    name: "Bob",
    age: 20
  });

  function handleClick() {
    // NG
    setObj({age: 100});
    // OK
    setObj({ ...obj, age: 100 });
  }
```


### 04-5. state は独立しておりプライベート

state は画面上の個々のコンポーネントインスタンスに対してローカルです  
言い換えると、同じコンポーネントを 2 回レンダーした場合、それぞれのコピーは完全に独立した state を有することになります  
そのうちの 1 つを変更しても、もう 1 つには影響しません


試してみましょう  
index.js で Gallery コンポーネントを2つ呼び出してみます  

```js
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import Gallery from "./Gallery";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Gallery />
    <Gallery />
  </StrictMode>
);
```

それぞれのコンポーネントを操作しても、片方にしか作用しないことが確認できるはずです