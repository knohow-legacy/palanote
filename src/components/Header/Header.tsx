import React from 'react';
import './Header.css';

function Header({name, icon, children} : {name : any, icon?: any, children? : any}) {
  return (
    <div className="header">
        {icon && <h2>{icon}</h2>}
        <h2>{name}</h2>
        {children}
    </div>
  );
}

export default Header;
