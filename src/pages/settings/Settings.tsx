import React from 'react';
import './Settings.css';
import { Navigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';
import { Authentication } from '../../components/Authentication/Authentication';

import Header from '../../components/Header/Header';
import { Settings as SettingsIcon, Logout, DoNotDisturb, Visibility, ExploreOff, EditOffSharp } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { API } from '../../components/API/API';

function Settings() {
    const [logoutState, setLogoutState] = React.useState(!Authentication.isLoggedIn);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);

    const success = () => {
        Authentication.onLogoutSuccess();
        setLogoutState(true);
    }
    const error = () => {
        Authentication.onLogoutFailure();
        setLogoutState(false);
    }

    const result = useQuery(['user', 'me'], async () => await API.fetchUserById('me'));
    

    if (!Authentication.isLoggedIn) {
        return (<Navigate to="/" />);
    }

    return (
        <div className="page settings">
            <Header icon={<SettingsIcon />} name="Settings" />
            <main>
                <div className="profileSettings">
                    <div className="pfp" style={{backgroundImage: `url(${result.data?.pfp})`}} />
                    <main>
                        <label>Username</label>
                        <input type="text" disabled defaultValue={result.data?.username} />
                        <label>Bio</label>
                        <textarea disabled defaultValue={result.data?.bio} />
                        <div className="flexSetting" style={{borderTop: '1px solid #ccc', paddingTop: '10px'}}>
                            <Logout />
                            <GoogleLogout
                                clientId={Authentication.clientId}
                                buttonText="Log Out"
                                onLogoutSuccess={success}
                                onFailure={error}
                                className="googleLogoutBtn"
                            />
                            <button onClick={() => setShowDeleteModal(true)} className="deleteAccountBtn">Delete Account</button>
                        </div>
                    </main>
                </div>
                <div>
                    <p>PalaNote Version</p> <p>0.0.1</p>
                    <a href="https://knohow.github.io">Knohow 2022</a>
                </div>
            </main>
            {showDeleteModal && 
                (<div className="modal" onClick={() => setShowDeleteModal(false)}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <h1>Are you sure?</h1>
                        <ul className="iconList">
                            <li>
                                <DoNotDisturb />
                                <p>You can't undo this. It's permanent.</p>
                            </li>
                            <li>
                                <ExploreOff />
                                <p>You won't be able to create or share journals with others.</p>
                            </li>
                            <li>
                                <EditOffSharp />
                                <p>You won't be able to edit your journals, comments, or ratings.</p>
                            </li>
                            <li>
                                <Visibility />
                                <p>
                                    <b>This won't delete your published content</b>. Either delete them manually or contact us to request a deletion.
                                </p>
                            </li>
                        </ul>
                        <p>
                            Our goal is to help everyone create the best notes they can.
                            Your notes could be essential in helping someone from anywhere in the world.
                        </p>
                        <p>
                            But if you're absolutely sure you want to delete your account, click the button below.
                        </p>
                        <button className="deleteAccountBtn" onClick={() => API.deleteAccount()}>Yes, delete my account</button>
                    </div>
                </div>)
            }
        </div>
    );
}

export default Settings;
