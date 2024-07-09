import { useState, useEffect, useRef } from 'react';

import "./styles.css";
import Comment from "./Comment";
import History from "./History";
import InputForm from "./InputForm";

export default function CommentApp() {

  const createId = () => Math.random().toString(32);
  const [history, setHistory] = useState([]);

  const handleSubmit = (inputData) => {
    // console.log(inputData);
    setHistory([...history,
      {
        id: createId(),
        text: inputData.text,
        speed: inputData.speed,
        color: inputData.color,
        size: inputData.size,
        moving: true
      }]);
  };

  const handleDestroy = (id) => {
    setHistory(history.map(el => {
      if (el.id === id) {
        el.moving = false;
      }
      return el;
    }));
  };

  const handleDelete = (id) => {
    setHistory(history.filter(el => el.id != id));
  };

  return (
    <>
      <div className='flex'>
        <div className='movie_wrap'>
          <ul>
            {history
              .filter(el => el.moving)
              .map((el, i) => {
                return <Comment message={el.text} speed={el.speed} color={el.color} size={el.size} id={el.id} key={i} onDestroy={handleDestroy} />;
            })}
          </ul>
        </div>
        <History history={history} onDelete={handleDelete} />
      </div>
      <InputForm onSubmit={handleSubmit} />
    </>
  );
}
