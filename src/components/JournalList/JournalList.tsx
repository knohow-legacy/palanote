import React from 'react';
import { PublishedJournal } from '../API/API';
import Journal from '../Journal/Journal';
import Loading from '../Loading/Loading';
import './JournalList.css';

function JournalList({journals} : {journals : Array<PublishedJournal> | null}) {
  return (
    <div className="journalList">
        {!journals && <Loading />}
        {journals && journals.map((journal, index) => <Journal key={index} index={index} journal={journal} expanded={false} />)}
    </div>
  );
}

export default JournalList;
