# chapter-01 JSX


## 02-1. JSX (JavaScript XML)

「JS」は `JavaScript`、 「X」は `XML` を意味します  
※JavaScript Syntax eXtension とも呼ばれます
JSXはJavaScriptの構文の中に直接XMLのようなタグベースの構文を記述するための言語拡張です  
開発元はReactと同じくMeta社になります  

JSXの構文はHTMLに似ており、たとえば以下のような形になります

```jsx
const heading = <h1>Hello World!</h1>;
```

どうみてもHTMLに見えますがJavaScriptです  
右辺のJSX式の結果を変数に代入しています  


## 02-2. JSX の実行

JSXはそのままJavaScriptとして実行することはできません  
`トランスパイラ (transpiler)` という変換ツールを用いて、通常のJavaScriptへ変換が行われた後に実行されます  

たとえば02-1 のコードを変換すると、以下のようになります  

```jsx
// 変換前 (JSX)
const heading = <h1>Hello World!</h1>;
```
```js
// 変換後 (JS)
const heading = React.createElement("h1", null, "Hello World!");
```

つまるところ、JSX は `React.createElement` の糖衣構文 (シンタックスシュガー) ということです  
ネストが深くなったり、コンポーネントが増え構造が複雑化したアプリケーションを、読みやすく構築・管理するために利用されます  


## 02-3. JSX のルール

JSXはHTMLと酷似していますが、全く同じという訳ではありません  
より厳密となっているためいくつかルールが存在します


### 1. 常に単一のルート要素を返す

JSXでは、常に単一のルート要素を返さなければなりません  
複数の要素を含む場合、親タグで囲う必要があります  

例えば `<div>` 使うことができます

```js
return (
  <div>
    <h1>Hello World!</h1>
    <p>This is my first React component.</p>
  </div>
)
```

マークアップに余計な div を増やしたくない場合、`<>` と `</>` を使うこともできます  
これはフラグメントと呼ばれます

```js
return (
  <>
    <h1>Hello World!</h1>
    <p>This is my first React component.</p>
  </>
)
```

### 2. すべてのタグを閉じる

JSX ではすべてのタグを明示的に閉じる必要があります  
`<img>` のような自動で閉じるタグは `<img />` のようになりますし、`<li>` のような囲みタグは `<li></li>` と書かなければなりません  

### 3. キャメルケースで記載する 

JSX は JavaScript に変換され、中に書かれた属性は JavaScript オブジェクトのキーになります  
そのため内包するJavaScript の変数名には一定の制約があります  
例えば、名前にハイフンを含めたり `class` のような予約語を使ったりすることはできません  

```jsx
<img
  src=""
  alt=""
  className="myImage"
/>
```

### 4. JavaScriptの式には中括弧を使用する

JSXの中にJavaScriptの式を含める必要がある場合、中括弧 `{}` で囲む必要があります

```jsx
const myVariable;

// OK
<div>{myVariable}</div>

// NG
<div>myVariable</div>
```

中括弧の中はJavaScript式の解釈が行われるため、計算や条件判定を行うこともできます

```jsx
<p>The total cost is {25*10}</p>

<h1>{(x) < 15 ? "Welcome" : "Goodbye"}</h1>
```

## 02-4. JSX を利用してコンポーネントを作成する

では、JSXの記述を利用してコンポーネントを作成しましょう  
`App.js` を開き、以下のコードを記載します

```jsx
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}
```

これはボタンを表示する機能を有するコンポーネントです  
`MyButton` コンポーネントを宣言した後、別のコンポーネントにネストすることができます  

```jsx
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

※注意点※  
コンポーネントの指定は大文字で始める必要があります  
これは「Reactのコンポーネントである」ことを明示するためのルールです  
なお、HTML タグは小文字でなければなりません  

記述ができたら以下の手順で実行してみましょう

### Reactアプリケーションの実行

まず、プロジェクトのルートディレクトリ (/learning-react) をターミナルで開きます  
その後、以下のコマンドを入力します  

構築が成功した場合、 `http://localhost:3000/` で起動します（ブラウザが自動で起動するはず）

```
npm install && npm run start
```


## 02-5. コンポーネントにプロパティを渡す

コンポーネントが呼び出し側から値を受け取る処理を追加してみましょう  

まず、値を受け取る側のコンポーネントに引数を追加します
```jsx
function MyButton(props) {
  return (
    <button>
      Hi! {props.name}
    </button>
  );
}
```

次に値を渡す側（コンポーネント呼び出し側）から値を渡します  
レンダリングされると `MyButton` コンポーネントの表示内容がここで渡した値となることが確認できます  

```jsx
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton name="Bob" />
    </div>
  );
}
```

さらに、渡した値（props）をコンポーネント内の関数で参照してみましょう  

```jsx
function MyButton(props) {

  // 関数を追加
  function handleOnClick() {
        alert("Welcome! " + props.name);
  }

  // ボタンクリック時のイベントハンドラに↑の関数を設定する
  return (
    <button onClick={handleOnClick}>
      Hi! {props.name}
    </button>
  );
}
```