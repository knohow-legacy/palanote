import React from 'react';
import Journal from '../Journal/Journal';
import './JournalList.css';

function JournalList({journals} : {journals : Array<any>}) {
  return (
    <div className="journalList">
        {journals.map((journal, index) => <Journal key={index} index={index} journal={journal} expanded={false} />)}
    </div>
  );
}

export default JournalList;
