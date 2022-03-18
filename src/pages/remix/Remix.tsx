import React from 'react';
import { AutoMode, Tag } from '@mui/icons-material';

import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { API } from '../../components/API/API';
import { Authentication } from '../../components/Authentication/Authentication';

import Header from '../../components/Header/Header';
import JournalEditor from '../../components/JournalEditor/JournalEditor';
import TagInput from '../../components/TagInput/TagInput';
import Loading from '../../components/Loading/Loading';

function Remix() {
    const { journalId } = useParams();
    const titleRef = React.useRef(null);
    const [tags, setTags] = React.useState<string[]>([]);
    const result = useQuery(`journal-${journalId}`, async () => await API.fetchJournalById(journalId || ""), {
        enabled: !!journalId && Authentication.isLoggedIn
    });
    
    if (!Authentication.isLoggedIn) {
        return (<Navigate to="/login" />);
    }

    if (!journalId) return <Navigate to="/" />;

    return (
        <div className="page compose">
            {!result.data && <Header name={<AutoMode />}><h2>Remixing...</h2></Header>}
            {result.status === 'loading' && <Loading />}
            {result.data && <React.Fragment>
                <Header name={<AutoMode />}>
                    <input className="input" ref={titleRef} type="input" maxLength={100} placeholder={"Remix of " + result.data.title} />
                    <h2><Tag /></h2>
                    <TagInput tags={tags} setTags={setTags} />
                </Header>
                <JournalEditor draft={result.data} titleRef={titleRef} tags={tags} isRemix={true} />
            </React.Fragment>}
        </div>
    );
}

export default Remix;
