import React from 'react';
import './Error.css';

function Loading({text, hasBackground} : {text:string, hasBackground?:boolean}) {
  return (
    <div className="error" style={{color: hasBackground === false ? 'black' : '', backgroundColor: hasBackground === false ? 'transparent' : ''}}>
        <p>{text}</p>
    </div>
  );
}

export default Loading;
