import { AutoMode, Tag, Comment as CommentIcon, Bookmark, Close } from '@mui/icons-material';
import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate, NavLink, useParams } from 'react-router-dom'; 
import { PublishedJournal, API } from '../API/API';
import './JournalPopout.css';
import ErrorImage from '../Journal/error.png';

import JournalActions from '../Journal/JournalActions/JournalActions';
import Popout from '../../pages/popout/Popout';
import Loading from '../Loading/Loading';
import Error from '../Error/Error';
import CommentInput from '../../pages/journal/Comment/CommentInput';
import Comment from '../../pages/journal/Comment/Comment';

function JournalPopout() {
    const { journalId } = useParams();
    const [isLoadingJournal, setIsLoadingJournal] = React.useState(true);
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);
    const result = useQuery(['journal', journalId], async () => await API.fetchJournalById(journalId || ""), {
        enabled: !!journalId
    });
    const journal = result.data as PublishedJournal;
    const userResult = useQuery(['user', journal && journal.authorID], async () => await API.fetchUserById(journal.authorID), {
        enabled: !!result.isSuccess
    });
    const remixResult = useQuery(['journal', journal && journal.remixInfo['original-journal-id']], async () => await API.fetchJournalById(journal.remixInfo['original-journal-id']), {
        enabled: !!result.isSuccess && !!journal.remixInfo['is-remix']
    });
    const commentsResult = useQuery(`journal-comments-${journalId}`, async () => await API.fetchJournalComments(journalId || ""), {
        enabled: !!journalId
    })
    const remixesResult = useQuery(`journal-remixes-${journalId}`, async () => await API.fetchJournalRemixes(journalId || ""), {
        enabled: !!journalId
    })

    const navigate = useNavigate();

    return (
        <Popout className="journalPopout" onClickOut={isMobileOpen ? () => setIsMobileOpen(false) : null}>
            {result.status === 'loading' && <Loading />}
            {result.status === 'error' && <Error text="Journal not found." />}
            {result.status === 'success' && <div className="journal expanded">
                <h2>
                    {journal.title}
                    {remixResult.data ?
                        (<NavLink
                            onClick={(e) => {e.stopPropagation()}}
                            to={`/journal/${journal.remixInfo['original-journal-id']}`}
                            className="remix"
                        >
                            <AutoMode />
                            <span>Remix of {remixResult.data.title}</span>
                        </NavLink>) : ''}
                </h2>
                <b>{new Date(journal.timestampCreated).toDateString()}</b>
                <div className="topics">{journal.topics.map((tag, index) => <NavLink to={`/search/tag/${tag}`} key={index} onClick={(e:any) => {e.stopPropagation()}} className="tag"><Tag />{tag}</NavLink>)}</div>
                <div className="journalSvg">
                    <img
                        width="100%"
                        src={API.getMediaURL('svg', journal.authorID, journal.id)}
                        alt="Journal"
                        onLoad={() => setIsLoadingJournal(false)}
                        onError={(e:any) => {e.target.onerror = null; e.target.src = ErrorImage}}
                    />
                    {isLoadingJournal && <Loading hasBackground={false} />}
                    <span className="pageCount">{journal.pages} {journal.pages === 1 ? 'page' : 'pages'}</span>
                </div>
                <div className={"journalSidebar" + (isMobileOpen ? " open" : "")} onClick={(e) => e.stopPropagation()}>
                    <JournalActions onDelete={() => navigate(-1)} toJournal={() => {}} journal={journal} remixResult={remixResult} userData={userResult.status === 'success' ? userResult.data : userResult.status} />
                    <div className="comments">
                        <h3>{commentsResult.isSuccess && `${commentsResult.data.length} ${commentsResult.data.length === 1 ? 'comment' : 'comments'}`}</h3>
                        {journalId && <CommentInput journalId={journalId} />}
                        {(commentsResult.status === 'loading' || remixesResult.status === 'loading') && <Loading hasBackground={false} />}
                        {(commentsResult.status === 'error' || remixesResult.status === 'error') && <Error text="Something went wrong loading comments." />}
                        {(commentsResult.status === 'success') && commentsResult.data.reverse().map((comment:any) => (
                            <Comment key={comment.id} comment={comment} />
                        ))}
                    </div>
                    <div className="mobileToggle" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                        {!isMobileOpen && <>
                            <div>
                                <Bookmark />
                                <span>{journal.likes}</span>
                            </div>
                            <div>
                                <CommentIcon />
                                <span>{commentsResult.isSuccess ? commentsResult.data.length : 0}</span>
                            </div>
                            <div>
                                <AutoMode />
                                <span>{journal.remixInfo.remixes}</span>
                            </div>
                        </>}
                        {isMobileOpen && <div>
                            <Close />    
                        </div>}
                    </div>
                </div>
            </div>}
            {/*<div className="comments">
                <CommentInput journalId={journalId} />
                {(commentsResult.status === 'loading' || remixesResult.status === 'loading') && <Loading />}
                {(commentsResult.status === 'error' || remixesResult.status === 'error') && <Error text="Something went wrong loading comments." />}
                {(commentsResult.status === 'success') && commentsResult.data.map((comment:any) => (
                    <Comment key={comment.id} comment={comment} />
                ))}
                {remixesResult.status === 'success' && remixesResult.data.map((remix:any, index:any) => (
                    <Journal journal={remix} expanded={false} index={index} />
                ))}
                </div>*/}
        </Popout>
    );
}

export default JournalPopout;
