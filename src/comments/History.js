
export default function History(props) {

  // 削除ボタンが押されたときの処理
  const handleDelete = (e) => {
    props.onDelete(e.currentTarget.getAttribute('data-id'));
  };

  return (
    <div className='comments_wrap scrollable'>
      <ul>
        {props.history.map((el, index) => {
          return (
            <li key={index}>
              <span>{el.text}</span>
              <button onClick={handleDelete} data-id={el.id} >✕</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
