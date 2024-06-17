import React from 'react'

/**
 * React要素の描画
 *
 * 定数 message の内容を画面に表示してください
 * なお、以下の条件を満たすように要素を作成してください
 * 1. message の内容は、 h1, div, p タグを用いて表示すること
 * 2. import されている React モジュールを利用し、Reactの要素を生成し表示すること
 *
 * 【ヒント】
 * React要素の生成は React.createElement でできる
 * 描画するときは {} で囲うこと
 */

export default function Q6_01() {

  // 変数定義や関数を記載する
  const message = "Hello World!"

  return (
    <div className='question-wrap'>
      <h1 className='question-title'>Q6_01</h1>
      <div className='question-content'>
      {/* ↓↓↓ 描画する内容を書く ↓↓↓ */}

      {/* ↑↑↑ 描画する内容を書く ↑↑↑ */}
      </div>
    </div>
  );
}