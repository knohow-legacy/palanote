import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGoogleLogout } from 'react-google-login';
import { Authentication } from '../../components/Authentication/Authentication';

import Header from '../../components/Header/Header';

function Settings() {
    const [logoutState, setLogoutState] = React.useState(!Authentication.isLoggedIn);

    function LogOut() {
        useGoogleLogout({
            clientId: Authentication.clientId,
            onLogoutSuccess: () => {
                Authentication.onLogoutSuccess();
                setLogoutState(true);
            },
            onFailure: () => {
                Authentication.onLogoutFailure();
                setLogoutState(false);
            }
        })
    }
    

    if (!Authentication.isLoggedIn) {
        return (<Navigate to="/" />);
    }

    return (
        <div onClick={LogOut} className="page settings">
            <Header name="Settings" />
        </div>
    );
}

export default Settings;
