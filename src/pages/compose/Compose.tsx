import React from 'react';
import './Compose.css';
import { Edit } from '@mui/icons-material';

import { Navigate } from 'react-router-dom';
import { Authentication } from '../../components/Authentication/Authentication';

import Header from '../../components/Header/Header';
import JournalEditor from '../../components/JournalEditor/JournalEditor';

function Compose() {
  const titleRef = React.useRef(null);
  const tagRef = React.useRef(null);
  
  if (!Authentication.isLoggedIn) {
    return (<Navigate to="/login" />);
  }

  return (
    <div className="page compose">
        <Header name={<Edit />}>
          <input ref={titleRef} type="input" maxLength={100} placeholder="Untitled Journal..." />
          <input ref={tagRef} type="input" maxLength={100} placeholder="Tags..." />
        </Header>
        <JournalEditor titleRef={titleRef} tagRef={tagRef} />
    </div>
  );
}

export default Compose;
