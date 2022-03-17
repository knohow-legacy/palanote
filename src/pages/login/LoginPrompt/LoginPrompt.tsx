import React from 'react';
import './LoginPrompt.css';
import { Authentication } from '../../../components/Authentication/Authentication';
import { Error } from '@mui/icons-material';
import { GoogleLogin } from 'react-google-login';

function LoginPrompt({authState, setAuthState} : any) {

    const success = (response:any) => {
        Authentication.onLoginSuccess.call(Authentication, response).then(
            (success:boolean) => {setAuthState(success ? 'success' : 'error')});
    }
    const error = (response:any) => {
        Authentication.onLoginFailure.call(Authentication, response)
    }

    return (
        <div className="loginPrompt">
            <p>Log in to create posts, follow tags and creators, and more.</p>
            <GoogleLogin
                clientId={Authentication.clientId}
                buttonText="Sign In with Google"
                onSuccess={success}
                onFailure={error}
                accessType="offline"
                prompt="consent"
                responseType="code"
                cookiePolicy={'single_host_origin'}
            />
            {authState === 'error' && <p className="errorMsg"><Error /> Something went wrong on our end. Please try again.</p>}
        </div>
    );
}

export default LoginPrompt;
