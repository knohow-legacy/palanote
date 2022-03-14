import React from 'react';
import '../ProfilePage.css';

function Banner({src} : any) {
    return (
        <div className="banner" style={{background: src ? `url(${src})` : ''}} />
    );
  }

export default Banner;
