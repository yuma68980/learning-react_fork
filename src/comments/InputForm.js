import React, { useState } from 'react';

export default function InputForm(props) {

  // 入力値の state を用意する
  const [text, setText] = useState('');
  const [speed, setSpeed] = useState('5');
  const [color, setColor] = useState('black');
  const [size, setSize] = useState('14');

  // 入力値に変更が生じたときの処理
  const handleChange = e => {
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
    props.onSubmit({text, speed, color, size});
    // 入力値を空にする
    setText('');
  };

  return (
    <div className='form_wrap flex'>
      <input
        type="text"
        value={text}
        placeholder="Enter to Submit"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <select
        value={speed}
        onChange={(e) => setSpeed(e.target.value)}
      >
        <option value="5">Default</option>
        <option value="1">Slow</option>
        <option value="15">Fast</option>
      </select>
      <select
        value={color}
        onChange={(e) => setColor(e.target.value)}
      >
        <option value="black">BLACK</option>
        <option value="red">RED</option>
        <option value="green">GREEN</option>
        <option value="blue">BLUE</option>
      </select>
      <input
        type="text"
        value={size}
        placeholder="font size px"
        onChange={(e) => setSize(e.target.value)}
      />
      <input
        type="button"
        value="送信"
        onClick={handleSubmit}
      />
    </div>
  );
}