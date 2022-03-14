import React from 'react';
import '../ProfilePage.css';

function Pfp({src} : any) {
    return (
        <img className="pfp" src={src} />
    );
  }

export default Pfp;
