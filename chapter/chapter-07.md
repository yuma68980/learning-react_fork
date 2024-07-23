# chapter-07 非同期処理

【目標】  
非同期処理とは何か、同期処理とどう異なるのか、なぜ必要なのかを知る
Promise, async/await について知る


## 07-1. 同期・非同期とは

多くのプログラミング言語にはコードの評価の仕方として、  
・同期処理（sync）  
・非同期処理（async）  
という大きな分類があります  

いままで一般的に記述してきた処理は同期処理と呼ばれているものです  
同期処理ではコードを順番に処理していき、**ひとつの処理が終わるまで次の処理は行いません**  
同期処理では実行している処理はひとつだけとなります

しかしこれには問題があります  
処理が終わるまで必ず待つ必要があるため、同期的にブロックする処理（時間が非常にかかるなど）はブラウザでは大きな問題となります  
JavaScriptは基本的にブラウザのメインスレッド（UIスレッドとも呼ばれる）で実行されるため  
JavaScriptの処理で専有されると、表示が更新されなくなりフリーズしたようになってしまいます  


ここで問題を解決するために登場するのが非同期処理となります  
非同期処理はコードを順番に処理していきますが、ひとつの非同期処理が終わるのを待たずに次の処理を評価します  
つまり、非同期処理では同時に実行している処理が複数あるということです

非同期処理の代表的な関数として `setTimeout` 関数などがあります
`delay` ミリ秒が経過した後、コールバック関数を実行するようにタイマーへ登録する非同期処理です

```
setTimeout(コールバック関数, delay);
```

## 07-2. 同期処理のUIブロック

同期処理によってメインスレッドが専有されることにより、画面の応答がなくなることを検証してみます  
以下の処理をHTMLファイルに記載、または https://js.do/ で実行してみましょう

「素数の生成」をクリックし、生成が完了するまでテキストボックスの入力は完全に無反応であることが分かると思います

```
<label for="quota">素数の個数:</label>
<input type="text" id="quota" name="quota" value="1000000" />
<button id="generate">素数の生成</button>
<textarea id="user-input" rows="5" cols="62">
［素数の生成］を押した直後にここに入力してみてください。
</textarea>
<div id="output"></div>
<script>
function isPrime(n) {
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return n > 1;
}

const random = (max) => Math.floor(Math.random() * max);

function generatePrimes(quota) {
  const primes = [];
  while (primes.length < quota) {
    const candidate = random(1000000);
    if (isPrime(candidate)) {
      primes.push(candidate);
    }
  }
  return primes;
}

const quota = document.querySelector("#quota");
const output = document.querySelector("#output");

document.querySelector("#generate").addEventListener("click", () => {
  const primes = generatePrimes(quota.value);
  output.textContent = `${quota.value} 個の素数を生成しました。`;
});
</script>
```

これが長時間実行される同期関数の基本的な問題です  
そのため、次のことをプログラムする方法が必要になります

1. 関数を呼んで長時間実行する処理を開始する
2. その関数が処理を開始してすぐに値を返すようにすることで、プログラムが他のイベントにも応答できるようにする
3. 最終的に処理が完了したら、その結果を通知する



## 07-3. 非同期処理に関する注意事項

非同期処理は名前から考えるとメインスレッド以外で実行されるように見えますが、   
基本的には非同期処理も同期処理と同じようにメインスレッドで実行されます  

ひとつの非同期処理が終わるのを待たずに次の処理を評価するため、  
「実行順序」がコードの見た目上の並びとは異なる順番で実行されることとなります  
つまり、実行順序は後回しとなりますが、メインスレッドを同期的に専有する処理を実行中はUIがブロックされてしまうわけです  

JavaScriptでは一部の例外を除き非同期処理が「並行処理（Concurrent）」として扱われます  
並行処理とは、処理を一定の単位ごとに分けて処理を切り替えながら実行することです  
そのため非同期処理の実行前にとても重たい処理があると、非同期処理の実行が遅れるという現象を引き起こします  

ただし、非同期処理の中にもメインスレッドとは別のスレッドで実行できるAPIが実行環境によっては存在します  
たとえばブラウザでは **Web Worker API** を使い、メインスレッド以外でJavaScriptを実行できます  

Web Workerにおける非同期処理は「並列処理（Parallel）」です  
並列処理とは、排他的に複数の処理を同時に実行することを指します  

## 07-4. Web Worker を利用した例

Web Worker を利用し、同期処理によるUIブロックを回避する例を以下に示します

素数生成の時間ががかる処理を別スレッド（Web Worker）で実行することにより、  
処理中もブラウザ操作ができることが確認できるはずです  

```
<label for="quota">素数の個数:</label>
<input type="text" id="quota" name="quota" value="1000000" />
<button id="generate">素数の生成</button>
<textarea id="user-input" rows="5" cols="62">
［素数の生成］を押した直後にここに入力してみてください。
</textarea>
<div id="output"></div>
<script>
function isPrime(n) {
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return n > 1;
}
function generatePrimes(quota) {
console.log(quota);
  const primes = [];
  while (primes.length < quota) {
    const candidate = Math.floor(Math.random() * 1000000);
    if (isPrime(candidate)) {
      primes.push(candidate);
    }
  }
  return primes;
}

const quota = document.querySelector("#quota");
const output = document.querySelector("#output");

document.querySelector("#generate").addEventListener("click", () => {
  new Promise((resolve, reject) => {
    const taskString = `
      const isPrime = ${isPrime.toString()};
      const task = ${generatePrimes.toString()};
        this.onmessage = (arg) => {
        postMessage(task(arg.data));
        }
    `;
    const blob = new Blob([taskString], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(blob));    
    worker.addEventListener('message', (m) => {
        resolve(m.data);
    });
    worker.postMessage(quota.value);
  }).then((resolve)=>{
    output.textContent = `${quota.value} 個の素数を生成しました。`;
  });
  output.textContent = `${quota.value} 個の素数を生成中...`;
});
</script>
```

## 07-5. Promise (プロミス)

「Promise」 は、JavaScript で非同期プログラミングを行う際の基礎となるものです  
このオブジェクトは、非同期処理の完了（もしくは失敗）の結果およびその結果の値を表します  

次のコードは、Promiseを扱う非同期処理を行う例です  
このコードは、大きく分けて2つの部分からなっています  

・非同期処理をする部分（asyncPromiseTask関数）: Promiseのインスタンスを返す  
・非同期処理の結果を扱う部分: Promiseのインスタンスを受け取り、成功時の処理と失敗時の処理をコールバック関数で登録する  

```
// asyncPromiseTask関数は、Promiseインスタンスを返す
function asyncPromiseTask() {
    return new Promise((resolve, reject) => {
        // さまざまな非同期処理を行う
        // 非同期処理に成功した場合は、resolveを呼ぶ
        // 非同期処理に失敗した場合は、rejectを呼ぶ
    });
}
// asyncPromiseTask関数の非同期処理が成功した時、失敗した時に呼ばれる処理をコールバック関数として登録する
asyncPromiseTask().then(()=> {
    // 非同期処理が成功したときの処理
}).catch(() => {
    // 非同期処理が失敗したときの処理
});
```

ここで、asyncPromiseTask関数は、Promiseというビルトインオブジェクトのインスタンスを返しています  
`Promise` インスタンスは、asyncPromiseTask関数内で行った非同期処理が `成功したか`, `失敗したか` の状態を表します  

このPromiseインスタンスに対し、`then` や `catch` メソッドを利用することで  
成功時や失敗時に呼び出される処理をコールバック関数として登録し、非同期処理の結果を扱うことができます  

同期的な関数では関数を実行するとすぐ結果がわかりますが、  
非同期な関数では関数を実行してもすぐには結果がわかりません  
そのため、非同期な関数はPromiseという非同期処理の状態をラップしたオブジェクトを返し、  
その結果が決まったら登録しておいたコールバック関数へ結果を渡すという仕組みになっています  


## 07-6. Promise インスタンスの作成

Promise は `new` 演算子でPromiseのインスタンスを作成して利用します

このときのコンストラクタには `resolve` と `reject` の2つの引数を取る executor と呼ばれる関数を渡します  
executor関数の中で非同期処理を行い、非同期処理が成功した場合は resolve 関数を呼び、失敗した場合は reject 関数を呼び出します  

```
const executor = (resolve, reject) => {
    // 非同期の処理が成功したときはresolveを呼ぶ
    // 非同期の処理が失敗したときはrejectを呼ぶ
};
const promise = new Promise(executor);
```

このPromiseインスタンスの `then`メソッドで、Promise が `resolve（成功）` 、`reject（失敗）`したときに呼ばれるコールバック関数を登録します  
thenメソッドの第一引数にはresolve（成功）時に呼ばれるコールバック関数、  第二引数にはreject（失敗）時に呼ばれるコールバック関数を渡します  

```
// `Promise`インスタンスを作成
const promise = new Promise((resolve, reject) => {
    // 非同期の処理が成功したときはresolve()を呼ぶ
    // 非同期の処理が失敗したときにはreject()を呼ぶ
});
const onFulfilled = () => {
    console.log("resolveされたときに呼ばれる");
};
const onRejected = () => {
    console.log("rejectされたときに呼ばれる");
};
// `then`メソッドで成功時と失敗時に呼ばれるコールバック関数を登録
promise.then(onFulfilled, onRejected);
```


ここで、`then` メソッドは成功と失敗のコールバック関数の2つを受け取りますが、どちらの引数も省略できます  
たとえば下記の例では成功時のコールバック関数だけを登録しています  

```
function delay(timeoutMs) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeoutMs);
    });
}

// `then`メソッドで成功時のコールバック関数だけを登録
delay(10).then(() => {
    console.log("10ミリ秒後に呼ばれる");
});
```

失敗時のコールバック関数だけの登録したい場合、以下のように第一引数には undefined を渡します  
ただし、同様のことを行う方法として `catch` メソッドが用意されているので、そちらを利用しましょう  

```
function errorPromise(message) {
    return new Promise((resolve, reject) => {
        reject(new Error(message));
    });
}

// 非推奨: `then`メソッドで失敗時のコールバック関数だけを登録
errorPromise("thenでエラーハンドリング").then(undefined, (error) => {
    console.log(error.message); // => "thenでエラーハンドリング"
});

// 推奨: `catch`メソッドで失敗時のコールバック関数を登録
errorPromise("catchでエラーハンドリング").catch(error => {
    console.log(error.message); // => "catchでエラーハンドリング"
});
```

## 07-7. Promise の状態

Promise インスタンスの状態は以下のいずれかとなります

・Pending (待機)  
　インスタンスを作成したときの初期状態  
　成功も失敗もしていない  
・Fulfilled (履行)  
　`resolve` （成功）したときの状態  
・Rejected (拒否)  
　`reject`（失敗）または例外が発生したときの状態  

Promise インスタンスの状態は作成時に `Pending` となり、  
一度でも `Fulfilled` または `Rejected` へ変化すると、それ以降状態は変化しなくなります  
そのため、`Fulfilled` または `Rejected` の状態であることを `Settled` （不変）と呼びます  

一度でも Settled となったPromiseインスタンスは、それ以降別の状態には変化しません  
resolve を呼び出した後に reject を呼び出しても、そのPromiseインスタンスは最初に呼び出したresolveによってFulfilledのままとなります



## 07-8. Async Function

Async Function は非同期処理を行う関数を定義する構文です  
※ Async (読み：エイシンク) 
Async Function は通常の関数とは異なり、`必ずPromiseインスタンスを返す` 関数を定義する構文です  

次のように関数の前に `async` をつけることで定義できます  

```
async function doAsync() {
    return "値";
}

// doAsync関数はPromiseを返す
doAsync().then(value => {
    console.log(value); // => "値"
});
```

この Async Function は次のように書いた場合と同じ意味になります  
Promise.resolve(返り値)のように返り値をラップしたPromiseインスタンスを返します  

```
// 通常の関数でPromiseインスタンスを返す
function doAsync() {
    return Promise.resolve("値");
}

doAsync().then(value => {
    console.log(value); // => "値"
});
```

JavaScriptの関数定義には関数宣言や関数式、Arrow Function、メソッドの短縮記法などがありますが、  
どの定義方法でも `async` キーワードを前につけるだけでAsync Functionとして定義できます  

```
// 関数宣言のAsync Function版
async function fn1() {}
// 関数式のAsync Function版
const fn2 = async function() {};
// Arrow FunctionのAsync Function版
const fn3 = async() => {};
// メソッドの短縮記法のAsync Function版
const obj = { async method() {} };
```

またAsync Function内では `await` 式というPromiseの非同期処理が完了するまで待つ構文が利用できます  
await式は右辺のPromiseインスタンスがFulfilledまたはRejectedになるまでその場で非同期処理の完了を待ちます  

```
async function asyncMain() {
    // PromiseがFulfilledまたはRejectedとなるまで待つ
    await Promiseインスタンス;
    // Promiseインスタンスの状態が変わったら処理を再開する
}
```

本来、非同期処理を実行した場合にその非同期処理の完了を待つことなく、次の行を実行しますが、  
await式では非同期処理を実行して完了するまで次の行を実行しません  
非同期処理が同期処理のように上から下へと順番に実行するように書くことができます  

```
// async functionは必ずPromiseを返す
async function doAsync() {
    // 非同期処理
}

async function asyncMain() {
    // doAsyncの非同期処理が完了するまでまつ
    await doAsync();
    // 次の行はdoAsyncの非同期処理が完了されるまで実行されない
    console.log("この行は非同期処理が完了後に実行される");
}
```

ここで、`await` は式であるため、await の右辺（Promiseインスタンス）の評価結果を値として返します  
awaitの右辺のPromiseがFulfilledとなった場合は、resolveされた値がawait式の返り値となります  
非同期処理の結果を値として受け取ることができることが利点となります

```
async function asyncMain() {
    const value = await Promise.resolve(42);
    console.log(value); // => 42
}

asyncMain(); // Promiseインスタンスを返す
```