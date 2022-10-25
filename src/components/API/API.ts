import { Authentication } from "../Authentication/Authentication";
import axios from 'axios';

const useProd = true;
const ENDPOINT = process.env.NODE_ENV === 'development' && !useProd ?
    'http://localhost:8080/api' :
    'https://postit-backend.azurewebsites.net/api';
//const ENDPOINT = 'https://knohow.azurewebsites.net/api';

export interface RemixInfo {
    "allow-remix": boolean;
    "is-remix": boolean;
    "original-journal-id": string;
    remixes: number;
    "remix-chain": number;
}
export interface Journal {
    title: string;
    topics: Array<string>;
    visibility: 'public' | 'unlisted' | 'private';
    isDraft: boolean;
    remixInfo: RemixInfo;
}

export interface PublishedJournal extends Journal {
    timestampCreated: number;
    id: string;
    authorID: string;
    likes: number;
    bookmarks: boolean;
    rating: number;
    comments: Array<string>;
    authenticated: boolean;
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
    authenticated: boolean;
    isFollowing: boolean; // Is the user following this user?
}
export interface Comment {
    user: string;
    content: string;
    pinned: boolean;
    heart: boolean;
    timestamp: number;
    id: string;
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

        if (resp && resp.status === 200) {
            return resp.data;
        }
        return {success: false};
    }

    async fetchHome(sortMode: string, remixMode: string, offset=0, limit=5) : Promise<Array<PublishedJournal>> {
        let headers : any = { 'Accept': 'application/json', 'Authorization': `Bearer ${Authentication.token}` };
        
        let resp = await axios.get(`${ENDPOINT}/fetch-user-feed/${offset}`, {headers: headers}).catch(() => {});
        
        if (resp) {
            return (resp as any).data;
        } else {
            throw new Error('Could not fetch journals from the server. :/');
        }
    }

    /**
     * Fetches a journal by ID.
     * @param {string} journalId - The ID of the journal to fetch.
     * @returns user - Success, and the journal object if true.
     */
     async fetchJournalById(journalId: string) : Promise<void | PublishedJournal> {
        let headers : any = { 'Accept': 'application/json' };
        if (Authentication.isLoggedIn) {
            headers['Authorization'] = `Bearer ${Authentication.token}`;
        }
        
        let resp = await axios.get(`${ENDPOINT}/fetch-journal-by-id/${journalId}`, {headers: headers}).catch(() => {});
        
        if (resp && resp.status === 200) {
            return resp.data;
        }
        throw new Error('Unable to fetch journal from server.')
    }

    async fetchJournalComments(journalId: string) : Promise<Array<Comment>> {
        if (!journalId) throw new Error('None specified');

        let headers : any = { 'Accept': 'application/json' };
        if (Authentication.isLoggedIn) {
            headers['Authorization'] = `Bearer ${Authentication.token}`;
        }
        
        let resp = await axios.get(`${ENDPOINT}/fetch-journal-comments/${journalId}`, {headers: headers}).catch(() => {});
        
        if (resp && resp.status === 200) {
            return resp.data;
        }
        throw new Error('Unable to fetch journal from server.')
    }

    async fetchJournalRemixes(journalId: string) : Promise<Array<PublishedJournal>> {
        if (!journalId) throw new Error('None specified');

        let headers : any = { 'Accept': 'application/json' };
        if (Authentication.isLoggedIn) {
            headers['Authorization'] = `Bearer ${Authentication.token}`;
        }
        
        let resp = await axios.get(`${ENDPOINT}/fetch-journal-remixes/${journalId}/0`, {headers: headers}).catch(() => {});
        
        if (resp && resp.status === 200) {
            return resp.data;
        }
        throw new Error('Unable to fetch journals from server.')
    }

    async postComment(journalId: string, content: string) : Promise<boolean> {
        if (!Authentication.isLoggedIn) throw new Error('Unauthorized');

        let resp = await axios.post(`${ENDPOINT}/comment`, {
            journalID: journalId,
            comment: content
        }, {
            headers: {
                'Authorization': `Bearer ${Authentication.token}`,
            }
        }).catch(() => {});
        if (resp && resp.status === 200) {
            return resp.data.success;
        }
        throw new Error('Cannot comment');
    }

    async fetchJournalsByUser(userId: string, sortMode: string, remixMode:string, offset=0, limit=5) {
        let headers : any = { 'Accept': 'application/json' };
        if (Authentication.isLoggedIn) {
            headers['Authorization'] = `Bearer ${Authentication.token}`;
        }

        // react-query can handle errors
        let resp = await axios.get(`${ENDPOINT}/fetch-journals-by-author-id/${userId}/${offset}/${sortMode}/${remixMode}`, {headers}).catch(() => {});
        
        if (resp) {
            return (resp as any).data;
        } else {
            throw new Error('Could not fetch journals from the server. :/');
        }
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
        if (resp) {
            return (resp as any).data;
        } else {
            throw new Error('Could not fetch user from the server. :/');
        }
    }

    /**
     * Fetches the user that is currently logged in (by token).
     * @returns {Promise<{success: boolean, user?: User}>} Success, and the user object if true.
     */
    fetchSelf() : Promise<User> { return this.fetchUserById('me'); }

    getMediaURL(fileType: 'json'|'svg', userID: string, postID: string) {
        return `${ENDPOINT.replace('/api', '/media')}/uploads/${fileType}/${userID}/${postID}`;
    }

    async fetchMedia(fileType: 'json'|'svg', userID: string, postID: string) {
        let headers : any = { 'Accept': 'application/json' };
        if (Authentication.isLoggedIn) {
            headers['Authorization'] = `Bearer ${Authentication.token}`;
        }
        
        let resp = await axios.get(this.getMediaURL(fileType, userID, postID), {headers: headers}).catch(() => {});
        if (resp && resp.status === 200) {
            return resp.data;
        }
        throw new Error('Could not fetch media from the server. :/');
    }


    async uploadJournal(journal: Journal, json: string, svg: string) : Promise<{success: false} | {success: true, journalID: string}> {
        if (!Authentication.isLoggedIn) throw new Error('Unauthorized');

        let resp =  await axios.post(`${ENDPOINT}/upload-journal`, JSON.stringify(journal), {
            headers: {
                'Authorization': `Bearer ${Authentication.token}`,
                'Content-Type': 'application/json'
            }
        }).catch(() => {});

        if (resp && resp.status === 200) {
            let resp2 = await axios.post(`${ENDPOINT.replace('/api', '/media')}/upload`, JSON.stringify({
                userID: await this.fetchSelf().then(user => user.id),
                journalID: resp.data.JournalID,
                json,
                svg: encodeURIComponent(svg)
            }), {
                headers: {
                    'Authorization': `Bearer ${Authentication.token}`,
                    'Content-Type': 'application/json'
                }
            }).catch(() => {});

            if (resp2 && resp2.data) {
                return {success: true, journalID: resp.data.JournalID};
            }
        }
        return {success: false};
    }

    async patchJournal(journal: PublishedJournal, json: string, svg: string) : Promise<{success: false} | {success: true, journalID: string}> {
        if (!Authentication.isLoggedIn) throw new Error('Unauthorized');

        let resp =  await axios.patch(`${ENDPOINT}/update-journal`, JSON.stringify({
            journalID: journal.id,
            title: journal.title,
            topics: journal.topics,
            isDraft: journal.isDraft,
            visibility: journal.visibility
        }), {
            headers: {
                'Authorization': `Bearer ${Authentication.token}`,
                'Content-Type': 'application/json'
            }
        }).catch(() => {});

        if (resp && resp.status === 200) {
            let resp2 = await axios.post(`${ENDPOINT.replace('/api', '/media')}/upload`, JSON.stringify({
                userID: await this.fetchSelf().then(user => user.id),
                journalID: resp.data.JournalID,
                json,
                svg: encodeURIComponent(svg)
            }), {
                headers: {
                    'Authorization': `Bearer ${Authentication.token}`,
                    'Content-Type': 'application/json'
                }
            }).catch(() => {});

            if (resp2 && resp2.data) {
                return {success: true, journalID: resp.data.JournalID};
            }
        }
        return {success: false};
    }

    async deleteJournalbyId(journalId: string) : Promise<boolean> {
        if (!Authentication.isLoggedIn) throw new Error('Unauthorized');

        let resp = await axios.delete(`${ENDPOINT}/delete-journal/${journalId}`, {
            headers: {
                'Authorization': `Bearer ${Authentication.token}`,
            }
        }).catch(() => {});
        if (resp && resp.status === 200) {
            return true;
        }
        return false;
    }

    async deleteAccount() : Promise<boolean> {
        if (!Authentication.isLoggedIn) throw new Error('Unauthorized');

        let resp = await axios.delete(`${ENDPOINT}/delete-user`, {
            headers: {
                'Authorization': `Bearer ${Authentication.token}`,
            }
        }).catch(() => {});
        if (resp && resp.status === 200) {
            return true;
        }
        return false;
    }

    async followUser(userId: string) : Promise<boolean> {
        if (!Authentication.isLoggedIn) throw new Error('Unauthorized');

        let resp = await axios.post(`${ENDPOINT}/follow`, {
            "follow-type": "user",
            "data-entry": userId
        }, {
            headers: {
                'Authorization': `Bearer ${Authentication.token}`,
            }
        }).catch(() => {});
        if (resp && resp.status === 200) {
            return resp.data.isNowFollowed;
        }
        throw new Error('Cannot follow user');
    }

    async followTopic(topic: string) : Promise<boolean> {
        if (!Authentication.isLoggedIn) throw new Error('Unauthorized');

        let resp = await axios.post(`${ENDPOINT}/follow`, {
            "follow-type": "topic",
            "data-entry": topic
        }, {
            headers: {
                'Authorization': `Bearer ${Authentication.token}`,
            }
        }).catch(() => {});
        if (resp && resp.status === 200) {
            return resp.data.isNowFollowed;
        }
        throw new Error('Cannot follow user');
    }

    async bookmarkJournal(journalId: string) : Promise<boolean> {
        if (!Authentication.isLoggedIn) throw new Error('Unauthorized');

        let resp = await axios.post(`${ENDPOINT}/bookmark`, {
            journalID: journalId
        }, {
            headers: {
                'Authorization': `Bearer ${Authentication.token}`,
            }
        }).catch(() => {});
        if (resp && resp.status === 200) {
            return resp.data.isNowBookmarked;
        }
        throw new Error('Cannot bookmark journal');
    }

    private async _queryJournals({query, fields, sort, page, remix} : {query: string, fields: Array<string>, sort: string, page: number, remix: string}) {
        let headers : any = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
        if (Authentication.isLoggedIn) {
            headers['Authorization'] = `Bearer ${Authentication.token}`;
        }
        
        let resp = await axios.post(`${ENDPOINT}/query-journals`,
            JSON.stringify({query, fields, sort, page, remix}),
            {headers: headers}).catch(() => {});
        return (resp as any).data.results;
    }

    async fetchTagByQuery(tag: string, sortMode: string, remixMode:string, offset=0, limit=5) : Promise<any> {
        return this._queryJournals({
            query: tag,
            fields: ['tags'],
            sort: sortMode,
            page: offset,
            remix: remixMode
        })
    }

    async fetchJournalsByUsername(username: string, sortMode: string, remixMode:string, offset=0, limit=5) : Promise<any> {
        return this._queryJournals({
            query: username,
            fields: ['usernames'],
            sort: sortMode,
            page: offset,
            remix: remixMode
        })
    }

    async fetchJournalsByQuery(query: string, sortMode: string, remixMode:string, offset=0, limit=5) : Promise<any> {
        return this._queryJournals({
            query: query,
            fields: ['journals'],
            sort: sortMode,
            page: offset,
            remix: remixMode
        })
    }

    async fetchJournalsByQueryAll(query: string, sortMode: string, remixMode:string, offset=0, limit=5) : Promise<any> {
        return this._queryJournals({
            query: query,
            fields: ['tags', 'usernames', 'journals'],
            sort: sortMode,
            page: offset,
            remix: remixMode
        })
    }
}

export const API = new APIBase();