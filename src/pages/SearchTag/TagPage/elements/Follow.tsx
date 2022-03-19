import React from 'react';
import { Add, Remove } from '@mui/icons-material';
import '../TagPage.css';

import { API } from '../../../../components/API/API';

function Follow({tag, isFollowed} : {tag: string, isFollowed: boolean}) {
    let [followedState, setFollowedState] = React.useState(isFollowed);

    async function toggleFollowed() {
        setFollowedState(!followedState);

        // Update the state once request succeeds just to be sure
        setFollowedState(await API.followTopic(tag).catch(() => followedState));
    }

    return (
        <div onClick={toggleFollowed} className={followedState ? "actionBtn following" : "actionBtn"}>
            {followedState ? <Remove /> : <Add />}
            {followedState ? <span>Unfollow</span> : <span>Follow</span>}
        </div>
    );
  }

export default Follow;
