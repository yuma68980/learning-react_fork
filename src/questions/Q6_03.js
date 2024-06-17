import React from 'react'

/**
 * JSの値を描画する
 *
 * メンバーの個人情報が入ったJSオブジェクトがあります
 * これらの内容を全て ul タグ内に描画してください
 * なお、それぞれの内容を表示するフォーマットはサンプルの li タグを利用してください
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

export default function Q6_02() {

  // 変数定義や関数を記載する
  return (
    <div className='question-wrap'>
      <h1 className='question-title'>Q6_03</h1>
      <div className='question-content'>
      {/* ↓↓↓ 描画する内容を書く ↓↓↓ */}
        <p>members</p>
        <ul>
          <li>
            <p>名前:<span>A</span>さん</p>
            <p>年齢:<span>20</span>歳</p>
            <p>身長:<span>160</span>cm</p>
            <p>体重:<span>50</span>kg</p>
          </li>
        </ul>
      {/* ↑↑↑ 描画する内容を書く ↑↑↑ */}
      </div>
    </div>
  );
}