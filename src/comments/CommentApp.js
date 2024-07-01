import { useState, useEffect, useRef } from 'react';

import "./styles.css";
import Comment from "./Comment";
import History from "./History";
import InputForm from "./InputForm";

export default function CommentApp() {

  const createId = () => Math.random().toString(32);
  const [history, setHistory] = useState([]);

  const handleSubmit = (text) => {
    setHistory([...history, {id: createId(), text, moving: true}]);
  };

  const handleDestroy = (id) => {
    setHistory(history.map(el => {
      if (el.id === id) {
        el.moving = false;
      }
      return el;
    }));
  };

  return (
    <>
      <div className='flex'>
        <div className='movie_wrap'>
          <ul>
            {history
            .filter(el => el.moving)
            .map((el, i) => {
              return <Comment message={el.text} id={el.id} key={i} onDestroy={handleDestroy} />;
            })}
          </ul>
        </div>
        <History history={history} />
      </div>
      <InputForm onSubmit={handleSubmit} />
    </>
  );
}
