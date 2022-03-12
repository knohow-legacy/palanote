import React from 'react';
import './Profile.css';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';

function Profile() {
    let { userId } = useParams();
    return (
      <div className="page profile">
        <Header name={`Profile ${userId}`} />
        <span>code something</span>
      </div>
    );
  }

export default Profile;
