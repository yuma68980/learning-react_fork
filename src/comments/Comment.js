import { useState, useEffect, useRef} from 'react';

export default function Comment(props) {

  const moveX = 5;
  const elm = useRef(null);
  const [position, setPosition] = useState({
    left: 0,
    top: Math.random() * 1000
  });

  useEffect(() => {
    // 座標の再計算
    setInterval(() => {
      setPosition((position) => {
        return {...position, left: position.left + moveX};
      })
    }, 16.6);
  }, []);

  if (elm.current) {
    const elmRect = elm.current.getBoundingClientRect();
    const parentRect = elm.current.parentElement.getBoundingClientRect();
    if (parentRect.right < elmRect.left) {
      props.onDestroy(props.id);
    }
  }

  return (
    <>
      <span
        ref={elm}
        style={{
          position: 'absolute',
          top: position.top + 'px',
          left: position.left + 'px',
        }}
      >{props.message}</span>
    </>
  );
}
