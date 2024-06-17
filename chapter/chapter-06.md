# chapter-06 練習問題

これまで、基本的な React の機能についてサンプルを利用しながら学んできました  
ではここで練習問題を解いて（実装して）復習しましょう  


`src/questions` フォルダ内に問題用のファイル (Q06_1～) が存在します  
それぞれの課題について実装を行ってみましょう  

各課題が完成したら `src/index.js` へファイルを import し、コンポーネント呼び出しを定義します  
またその後 `npm run start` でアプリを立ち上げて実行してみましょう

【例】  
`src/index.js` へ `Q06_1.js` を追記し実行する

```js
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";
import Q6_01 from "./questions/Q6_01";   // 問題のコンポーネントを追記
import Q6_02 from "./questions/Q6_02";   // ※複数も可能

const root = createRoot(document.getElementById("root"));
// import と同様にコンポーネントを追記
root.render(
  <StrictMode>
    <App />
    <Q6_01 />
    <Q6_02 />
  </StrictMode>
);
```
