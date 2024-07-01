import React, { useState } from 'react';

export default function InputForm(props) {

  // 入力値の state を用意する
  const [text, setText] = useState('');

  // 入力値に変更が生じたときの処理
  const handleChange = e => {
    // Enter が押された場合は送信
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
    // Enter 以外であれば入力値を反映する
    setText(e.target.value);
  };

  // キーが押されたときの処理
  const handleKeyDown = e => {
    // Enter が押された場合は送信
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  // 送信ボタンが押されたときの処理
  const handleSubmit = e => {
    // 入力値が空白文字の場合終了
    if (!text.match(/\S/g) ) return;
    // propsで渡された送信処理を実行
    props.onSubmit(text);
    // 入力値を空にする
    setText('');
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        placeholder="Enter to Submit"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <input
        type="button"
        value="送信"
        onClick={handleSubmit}
      />
    </div>
  );
}