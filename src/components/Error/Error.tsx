import React from 'react';
import './Error.css';

function Loading({text} : {text:string}) {
  return (
    <div className="error">
        <p>{text}</p>
    </div>
  );
}

export default Loading;
