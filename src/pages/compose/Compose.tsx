import React from 'react';
import './Compose.css';

import Header from '../../components/Header/Header';
import JournalEditor from '../../components/JournalEditor/JournalEditor';

function Compose() {
  return (
    <div className="page compose">
        <Header name="Compose" />
        <JournalEditor />
    </div>
  );
}

export default Compose;
