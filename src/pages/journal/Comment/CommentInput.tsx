import React from 'react';
import Loading from '../../../components/Loading/Loading';
import { API } from '../../../components/API/API';
import './Comment.css';
import { useQueryClient } from 'react-query';

function CommentInput({journalId} : {journalId: string}) {
    const [isLoading, setLoading] = React.useState(false);
    const [charsLeft, setCharsLeft] = React.useState(2000);
    const inputRef = React.useRef<any>(null);
    const queryClient = useQueryClient();

    async function postComment() {
        if (!inputRef || !inputRef.current.value) {
            return alert("Your comment is empty!");
        }
        setLoading(true);
        await API.postComment(journalId, inputRef.current.value || "No text provided");
        queryClient.invalidateQueries(`journal-comments-${journalId}`);
        setLoading(false);
    }

    return (
        <div className="comment addComment">
            {isLoading && <Loading />}
            <textarea
                ref={inputRef}
                placeholder="Leave a comment..."
                maxLength={2000}
                onChange={(e) => setCharsLeft(2000 - (e.target as any).value.length)}
            />
            <div className="charsLeft" style={{color: charsLeft < 200 ? 'var(--danger)' : ''}}>{charsLeft}</div>
            <div onClick={postComment} className="commentBtn">Comment</div>
        </div>
    );
}

export default CommentInput;
