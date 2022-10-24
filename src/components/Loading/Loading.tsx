import React from 'react';
import './Loading.css';

function Loading({hasBackground} : {hasBackground?: boolean} = {hasBackground: true}) {
  return (
    <div className="loading" style={{backgroundColor: hasBackground === false ? 'transparent' : ''}}>
        <div className="spinner" />
    </div>
  );
}

export default Loading;
