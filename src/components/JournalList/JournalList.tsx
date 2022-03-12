import React from 'react';
import './App.css';

function JournalList({journals} : {journals : Array<any>}) {
  return (
    <div className="journalList">
        {journals}
    </div>
  );
}

export default JournalList;
