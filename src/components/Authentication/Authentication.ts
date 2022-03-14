import { API } from '../API/API';

/* Handles main authorization from the backend. */
const clientId = '693015144456-ec830vvq03j21rl0av8kg10vav4ma40a.apps.googleusercontent.com';


export class AuthenticationBase {
    isLoggedIn : boolean = false;
    clientId : string = clientId;
    token : string | null = null;

    constructor() {
        this.token = localStorage.getItem('PI-token') || null;
        
        if (this.token) {
            this.isLoggedIn = true;
        }
    }

    onLogoutSuccess() {
        this.isLoggedIn = false;
        localStorage.removeItem('PI-token');
    }
    onLogoutFailure() {

    }
    async onLoginSuccess(res:any) : Promise<boolean> {
        let resp = await API.signIn(res.code);
        if (resp.success) {
            this.isLoggedIn = true;
            this.token = resp.token;
            localStorage.setItem('PI-token', this.token as string);
            return true;
        }
        return false;
    }
    onLoginFailure(res:any) {

    }
}

export const Authentication = new AuthenticationBase();