
export default function History(props) {
  return (
    <div className='comments_wrap scrollable'>
      <ul>
        {props.history.map((el, index) => {
          return <li key={index}>{el.text}</li>;
        })}
      </ul>
    </div>
  );
}