import React from 'react';
import { Navigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';
import { Authentication } from '../../components/Authentication/Authentication';

import Header from '../../components/Header/Header';

function Settings() {
    const [logoutState, setLogoutState] = React.useState(!Authentication.isLoggedIn);

    const success = () => {
        Authentication.onLogoutSuccess();
        setLogoutState(true);
    }
    const error = () => {
        Authentication.onLogoutFailure();
        setLogoutState(false);
    }
    

    if (!Authentication.isLoggedIn) {
        return (<Navigate to="/" />);
    }

    return (
        <div className="page settings">
            <Header name="Settings" />
            <GoogleLogout
                clientId={Authentication.clientId}
                buttonText="Log Out"
                onLogoutSuccess={success}
                onFailure={error}
            />
        </div>
    );
}

export default Settings;
