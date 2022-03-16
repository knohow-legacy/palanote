import React from 'react';
import '../TagPage.css';

function TagBio({name} : any) {
    return (
        <div className="bio">
            <h1>{name}</h1>
            <p>Follow this topic to get journals tagged with it in your feed.</p>
        </div>
    );
  }

export default TagBio;
