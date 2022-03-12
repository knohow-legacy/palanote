import React from 'react';
import './Header.css';

function Header({name, children} : {name : string, children? : any}) {
  return (
    <div className="header">
        <h2>{name}</h2>
        {children}
    </div>
  );
}

export default Header;
