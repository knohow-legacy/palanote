import { Authentication } from "../Authentication/Authentication";
import axios from 'axios';

const ENDPOINT = 'http://localhost:3001/api';

export interface RemixInfo {
    "allow-remix": boolean;
    "is-remix": boolean;
    "original-journal-id": string;
    remixes: number;
    "remix-chain": number;
}
export interface Journal {
    content: {
        data: string; // SVG string
    }
    title: string;
    topics: Array<string>;
    visibility: 'public' | 'unlisted' | 'private';
    isDraft: boolean;
    remixInfo: RemixInfo;
}

export interface PublishedJournal extends Journal {
    timestampCreated: number;
    id: number;
    authorID: string;
    likes: number;
    comments: Array<string>;
}

export interface User {
    id: string;
    pfp: string,
    username: string;
    followers: number;
    followedTopics: string[];
    bio?: string;
    //followerCount: number;
    //followingCount: number;
    timestampCreated: number;
}

export const DefaultUser = {
    id: '0',
    pfp: '',
    username: '[Deleted]',
    bio: '',
    timestampCreated: 0
}

export class APIBase {
    async signIn(token: string) : Promise<{success: false} | {success: true, token: string, userID: string}> {
        let resp = await axios.post(`${ENDPOINT}/sign-in`, null, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).catch(() => {});

        if (resp && resp.status == 200) {
            return resp.data;
        }
        return {success: false};
    }

    /**
     * Fetches a journal by ID.
     * @param {string} journalId - The ID of the journal to fetch.
     * @returns user - Success, and the journal object if true.
     */
     async fetchJournalById(journalId: string) : Promise<{success: false} | {success: true, journal: PublishedJournal}> {

        let headers : any = { 'Accept': 'application/json' };
        if (Authentication.isLoggedIn) {
            headers['Authorization'] = `Bearer ${Authentication.token}`;
        }
        
        let resp = await axios.get(`${ENDPOINT}/fetch-journal-by-id/${journalId}`, {headers: headers}).catch(() => {});
        
        if (resp && resp.status === 200) {
            return {success: true, journal: resp.data};
        }
        return {success: false};
    }

    async fetchJournalsByUser(userId: string, offset=0, limit=5) {
        let headers : any = { 'Accept': 'application/json' };
        if (Authentication.isLoggedIn) {
            headers['Authorization'] = `Bearer ${Authentication.token}`;
        }

        // react-query can handle errors
        let resp = await axios.get(`${ENDPOINT}/fetch-journals-by-author-id/${userId}/${offset}`, {headers}).catch(() => {});
        return (resp as any).data;
    }

    /**
     * Fetches a user by ID.
     * @param {string} userId - The ID of the user to fetch.
     * @returns {Promise<{success: false} | {success: true, user: User}>} user - Success, and the user object if true.
     */
    async fetchUserById(userId: string) : Promise<User> {

        let headers : any = { 'Accept': 'application/json' };
        if (Authentication.isLoggedIn) {
            headers['Authorization'] = `Bearer ${Authentication.token}`;
        }
        
        let resp = await axios.get(`${ENDPOINT}/fetch-user-by-id/${userId}`, {headers: headers}).catch(() => {});
        return (resp as any).data;
    }

    /**
     * Fetches the user that is currently logged in (by token).
     * @returns {Promise<{success: boolean, user?: User}>} Success, and the user object if true.
     */
    fetchSelf() : Promise<User> { return this.fetchUserById('me'); }


    async uploadJournal(journal: Journal) : Promise<{success: false} | {success: true, journalID: string}> {
        if (!Authentication.isLoggedIn) throw new Error('Unauthorized');

        let resp =  await axios.post(`${ENDPOINT}/upload-journal`, JSON.stringify(journal), {
            headers: {
                'Authorization': `Bearer ${Authentication.token}`,
                'Content-Type': 'application/json'
            }
        }).catch(() => {});
        if (resp && resp.status === 200) {
            return {success: true, journalID: resp.data.JournalID};
        }
        return {success: false};
    }

    async fetchTagByQuery(tag: string, offset=0, limit=5) : Promise<any> {
        let headers : any = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
        if (Authentication.isLoggedIn) {
            headers['Authorization'] = `Bearer ${Authentication.token}`;
        }
        
        let resp = await axios.post(`${ENDPOINT}/query-journals`, JSON.stringify({
            query: tag,
            fields: ['tags'],
            sort: 'new',
            page: offset,
            remix: true
        }), {headers: headers}).catch(() => {});
        return (resp as any).data.results;
    }
}

export const API = new APIBase();