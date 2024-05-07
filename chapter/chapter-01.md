# chapter-01 Reactの基本


※以降、 `base.html` をコピーし、名前をチャプター名に変更したファイルを編集する。  
　例：src/chapter-01-1.html


## 01-1. React要素の描画

DOM要素　≠　React要素  
開発者がReactに対して「何を行いたいか」を指示する内容を収めたものです  
あくまでも最終的なDOMが どのようになるか を記述したものであり、DOMそのものではありません  

Reactはこれらの指示をもとにUIを構築・描画を実行します  

``` js
// L:18～に追記する

// <h1> タグを定義する
// 第1引数：要素のタイプ
// 第2引数：要素の持つプロパティ
// 第3引数：要素の持つ子要素
const heading = React.createElement("h1", {id: "heading-one"}, "Hello World!");

// 描画処理を実行
ReactDOM.render(
    heading,
    document.getElementById('react-container')
);

```

ここでReact要素をコンソールに出力してみましょう  
Reactに指示した結果、生成されたReact要素の中身が確認できます  

`type` や `props` に生成時に指定した値がコンソールに出力されることが確認できるはずです  

``` js
// ReactDOM.render の下に追記する
console.log('React要素', heading);
```

出力内容の例
``` js
React要素 Object
    $$typeof : Symbol(react.element)
    key : null
    props : {id: 'heading-one', children: 'Hello World!'}
    ref : null
    type : "h1"
    _owner : null
    _store : {validated: false}
    _self : null
    _source : null
    [[Prototype]] : Object
```

### 特殊なDOM属性

`createElement` の第2引数にて指定したDOM属性のうち、 `class`, `for`, `style` については注意が必要となります  
これらはJavaScriptの予約語と被るなどの背景から、特殊な記載方法をとります  

``` js
// 誤った例
const heading = React.createElement(
    "h1",
    {
        class: "heading-class",
        for: "me",
        style: "background: black;"
    },
    "Hello World!"
);

// 正しい例
const heading = React.createElement(
    "h1",
    {
        className: "heading-class",     // className で指定する
        htmlFor: "me",                  // htmlFor で指定する
        style: {                        // CSSプロパティをkey, 設定値をvalue に持つオブジェクトとして指定する
            background: "black"
        }
    },
    "Hello World!"
);

```


### React.DOM.*

React.createElement では第1引数で要素のタイプを指定しましたが、この記述を省きメソッド名で明示的に指定することができます  
`React.DOM` の配下にはHTMLの各要素がReactのコンポーネントとして用意されています  

``` js
// 同じ意味
const elm1 = React.createElement("h1", {id: "heading-one"}, "Hello World!");
const elm2 = React.DOM.h1({id: "heading-one"}, "Hello World!");
```


<br>

## 01-2. 要素のネスト

Reactにおいて子要素は `props.children` に格納されます  
01-1 では文字列を子要素に指定しましたが、他のReact要素を子要素に指定することも勿論可能です  

ネストした要素ツリーを作成してみましょう  

``` js
// <ul>要素とネストされた<li>要素を定義する
const world = React.createElement("section", null,
    React.createElement("h1", null, "Hello World!"),
    React.createElement("h2", null, "asian countrys"),
    React.createElement("ul", {"className": "countrys"},
        React.createElement("li", null, "Japan"),
        React.createElement("li", null, "Korea"),
        React.createElement("li", null, "China"),
        React.createElement("li", null, "India"),
        React.createElement("li", null, "Singapore")
    ),
);

// 描画
ReactDOM.render(
    world,
    document.getElementById('react-container')
);

// React要素のログを出す
console.log('React要素', heading);
```

<br>

## 01-3. 配列から要素を生成する

Reactを採用する利点のひとつとして、UIとデータの関心を分離できることが挙げられます  
ReactはJavaScriptであるため `複雑な処理` や `繰り返しを要する処理` はJavaScriptのロジックを記述すればよいのです  

01-2 で先ほど記述したコードでは単純に同じ記載を繰り返しているため非常に冗長といえます  
ここで、重複している箇所を抽出してみると以下のようなリストが生成できます  

``` js
// 国名の配列
const countrys = [
    "Japan",
    "Korea",
    "China",
    "India",
    "Singapore"
];
```

この配列をもとに、`Array.map` を利用してReact要素を生成してみましょう  
※実行時に `key` に関する警告がでますが、それは次項で解消します  

``` js
// 配列をもとにReact要素を生成する
const world = React.createElement("section", null,
    React.createElement("h1", null, "Hello World!"),
    React.createElement("h2", null, "asian countrys"),
    React.createElement("ul", {"className": "countrys"},
        countrys.map((name, i) =>
            React.createElement("li", null, name)
        )
    ),
);

// 描画
ReactDOM.render(
    world,
    document.getElementById('react-container')
);
```

上のコードでは、配列 `countrys` の数だけ処理を繰り返し、`<li>` 要素を生成しています  
各ループごとに 変数 `name` に配列 `countrys` の中身１件１件が代入され、それをReact要素に埋め込んでいます  

<br>

## 01-4. keyプロパティの定義

01-3のコードを実行すると、以下のような警告が表示されます  
```
Warning: Each child in an array or iterator should have a unique "key" prop. Check the top-level render call using <ul>.
```

例のように、要素の配列を別の要素の子要素に指定する場合、各要素は `key` プロパティを持つ必要があります  
これはReactが要素の更新を管理するために、各要素を判別するためのユニークな値が必要となるためです  

以下のように配列のインデックス値を `key` に設定することで警告は回避できます

``` js
// 配列をもとにReact要素を生成する
const world = React.createElement("section", null,
    React.createElement("h1", null, "Hello World!"),
    React.createElement("h2", null, "asian countrys"),
    React.createElement("ul", {"className": "countrys"},
        countrys.map((name, i) =>
            React.createElement("li", {key: i}, name)
        )
    ),
);

// 描画
ReactDOM.render(
    world,
    document.getElementById('react-container')
);
```

<br>

## 01-5. Reactコンポーネント

UIはボタンやリスト、見出しといった複数の部品によって構成されています  
同じ構成のUI部品を使いまわしたいとき、Reactコンポーネントが利用できます  

React におけるコンポーネントとは、マークアップを返す JavaScript 関数です  

例えば表示するデータの内容が異なっていたとしても、同じ構造をもつデータはひとつのコンポーネントを利用して描画できます  
ReactでUIを構築する際には、まず表示する要素を `再利用可能な部品に分割` しコンポーネント化することを考慮しましょう  

では、01-4をベースにコンポーネントを作成してみましょう

``` js
// 国名リストのコンポーネント
function countryList(props) {
  return React.createElement(
    "ul",
    { className: "countrys" },
    props.countrys.map((name, i) =>
        React.createElement("li", {key: i}, name)
    )
  );
};

// 国名
const asia = [
    "Japan",
    "Korea",
    "China",
    "India",
    "Singapore"
];
const europa = [
    "Iceland",
    "French",
    "Germany",
    "Italia"
];

// 描画
ReactDOM.render(
    React.createElement("section", null,
        React.createElement(countryList, {countrys:asia}, null),
        React.createElement(countryList, {countrys:europa}, null)
    ),
    document.getElementById('react-container')
);

```

分割代入 (Destructuring) を利用し、`props` を省きより簡潔に書くこともできます  
参考：https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment

``` js
function countryList({ countrys }) {
  return React.createElement(
    "ul",
    { className: "countrys" },
    countrys.map((name, i) =>
        React.createElement("li", {key: i}, name)
    )
  );
};
```

