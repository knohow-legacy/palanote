import React from 'react';
import './Compose.css';
import { Edit, Tag } from '@mui/icons-material';

import { Navigate } from 'react-router-dom';
import { Authentication } from '../../components/Authentication/Authentication';

import Header from '../../components/Header/Header';
import JournalEditor from '../../components/JournalEditor/JournalEditor';
import TagInput from './TagInput';

function Compose() {
  const titleRef = React.useRef(null);
  const [tags, setTags] = React.useState<string[]>([]);
  
  if (!Authentication.isLoggedIn) {
    return (<Navigate to="/login" />);
  }

  return (
    <div className="page compose">
        <Header name={<Edit />}>
          <input className="input" ref={titleRef} type="input" maxLength={100} placeholder="Untitled Journal..." />
          <h2><Tag /></h2>
          <TagInput tags={tags} setTags={setTags} />
        </Header>
        <JournalEditor titleRef={titleRef} tags={tags} />
    </div>
  );
}

export default Compose;
