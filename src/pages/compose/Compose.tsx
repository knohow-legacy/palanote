import React from 'react';
import { Edit, Tag } from '@mui/icons-material';

import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { API } from '../../components/API/API';
import { Authentication } from '../../components/Authentication/Authentication';

import Header from '../../components/Header/Header';
import JournalEditor from '../../components/JournalEditor/JournalEditor';
import TagInput from '../../components/TagInput/TagInput';
import Loading from '../../components/Loading/Loading';

function Compose() {
  const titleRef = React.useRef(null);
  const { journalId } = useParams();
  const [tags, setTags] = React.useState<string[]>([]);
  const result = useQuery(`journal-${journalId}`,
    async () => await API.fetchJournalById(journalId || ""),
    { enabled: !!journalId && Authentication.isLoggedIn });
  
  if (!Authentication.isLoggedIn) {
    return (<Navigate to="/login" />);
  }

  if (!journalId || result.status === 'error') {
    return (
      <div className="page compose">
          <Header name={<Edit />}>
            <input className="input" ref={titleRef} type="input" maxLength={100} placeholder="Untitled Journal..." />
            <h2><Tag /></h2>
            <TagInput tags={tags} setTags={setTags} />
          </Header>
          <JournalEditor titleRef={titleRef} tags={tags} isRemix={false} />
      </div>
    );
  } else if (result.data && result.status === 'success') {
    // Draft exists; try to load it
    return (
      <div className="page compose">
          <Header name={<Edit />}>
            <input className="input" ref={titleRef} type="input" maxLength={100} defaultValue={result.data.title === 'Untitled Journal' ? '' : result.data.title} placeholder="Untitled Journal..." />
            <h2><Tag /></h2>
            <TagInput defaultTags={result.data.topics} tags={tags} setTags={setTags} />
          </Header>
          <JournalEditor draft={result.data} titleRef={titleRef} tags={tags} isRemix={false} />
      </div>
    );
  } else {
    return (
      <div className="page compose">
        <Header name={<Edit />}>
          <h2>Loading</h2>
        </Header>
        <Loading />
      </div>)
  }
  
}

export default Compose;
