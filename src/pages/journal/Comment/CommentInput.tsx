import React from 'react';
import Loading from '../../../components/Loading/Loading';
import { API } from '../../../components/API/API';
import './Comment.css';

function CommentInput({journalId} : {journalId: string}) {
    const [isLoading, setLoading] = React.useState(false);
    const inputRef = React.useRef<any>(null);

    async function postComment() {
        if (!inputRef || !inputRef.current.value) {
            return alert("Your comment is empty!");
        }
        setLoading(true);
        await API.postComment(journalId, inputRef.current.value || "No text provided");
        window.location.reload();
    }

    return (
        <div className="comment addComment">
            {isLoading && <Loading />}
            <textarea ref={inputRef} placeholder="Leave a comment..."></textarea>
            <div onClick={postComment} className="commentBtn">Comment</div>
        </div>
    );
}

export default CommentInput;
