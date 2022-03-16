import React from 'react';
import '../ProfilePage.css';

function Bio({name, bio, joinDate} : any) {
    return (
        <div className="bio">
            <h1>{name}</h1>
            <p>{bio}</p>
        </div>
    );
  }

export default Bio;
