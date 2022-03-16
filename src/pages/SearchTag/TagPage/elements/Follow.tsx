import React from 'react';
import { Add, Check } from '@mui/icons-material';
import '../TagPage.css';

function Follow({isFollowed} : {isFollowed: boolean}) {
    return (
        <div className="actionBtn">
            {isFollowed ? <Check /> : <Add />}
            {isFollowed ? <span>Following</span> : <span>Follow</span>}
        </div>
    );
  }

export default Follow;
