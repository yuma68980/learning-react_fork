import React from 'react'

/**
 * JSの値を描画する
 *
 * メンバーの個人情報が入ったJSオブジェクトがあります
 * 個人情報を表示するためのコンポーネントを作成し、呼び出すように修正してください
 * なお、コンポーネント呼び出しはデータの件数分実施されるようにしてください
 */

const members = [
  {
    name: "Tanaka",
    age: "20",
    height: "180",
    weight: "90"
  },
  {
    name: "Saito",
    age: "21",
    height: "175",
    weight: "60"
  },
  {
    name: "Sato",
    age: "25",
    height: "160",
    weight: "50"
  },
  {
    name: "Hayashi",
    age: "30",
    height: "155",
    weight: "80"
  },
  {
    name: "Naoi",
    age: "19",
    height: "190",
    weight: "100"
  }
];

export default function Q6_05() {

  // 変数定義や関数を記載する
  return (
    <div className='question-wrap'>
      <h1 className='question-title'>Q6_01</h1>
      <div className='question-content'>
      {/* ↓↓↓ 描画する内容を書く ↓↓↓ */}
        <p>members</p>
        <ul>
          {/* コンポーネント呼び出し */}
        </ul>
      {/* ↑↑↑ 描画する内容を書く ↑↑↑ */}
      </div>
    </div>
  );
}

// コンポーネントを追記する
// function component() {
// }