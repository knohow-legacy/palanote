import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from 'react-query';

import Header from '../../components/Header/Header';
import Error from '../../components/Error/Error';
import Journal from '../../components/Journal/Journal';
import { API, PublishedJournal } from '../../components/API/API';
import Loading from '../../components/Loading/Loading';
import Comment from './Comment/Comment';
import CommentInput from './Comment/CommentInput';

function JournalPage() {
    let { journalId } = useParams();

    const result = useQuery(['journal', journalId], async () => await API.fetchJournalById(journalId || ""),
    {enabled: !!journalId});
    const commentsResult = useQuery(`journal-comments-${journalId}`, async () => await API.fetchJournalComments(journalId || ""), {
        enabled: !!journalId
    })
    const remixesResult = useQuery(`journal-remixes-${journalId}`, async () => await API.fetchJournalRemixes(journalId || ""), {
        enabled: !!journalId
    })

    if (!journalId) return <Navigate to="/" />;

    return (
        <div className="page journalPage">
            <Header backBtn={true} name={result.status === 'success' ? (result.data as PublishedJournal).title : 'Journal'} />
            {result.status === 'loading' && <Loading />}
            {result.status === 'error' && <Error text="Journal not found." />}
            {result.status === 'success' && <Journal expanded={true} journal={result.data as PublishedJournal} />}
            <div className="comments">
                <CommentInput journalId={journalId} />
                {commentsResult.status === 'loading' || remixesResult.status === 'loading' && <Loading />}
                {commentsResult.status === 'error' || remixesResult.status === 'error' && <Error text="Something went wrong loading comments." />}
                {commentsResult.status === 'success' && commentsResult.data.map((comment:any) => (
                    <Comment key={comment.id} comment={comment} />
                ))}
                {remixesResult.status === 'success' && remixesResult.data.map((remix:any, index:any) => (
                    <Journal journal={remix} expanded={false} index={index} />
                ))}
            </div>
        </div>
    );
}

export default JournalPage;
