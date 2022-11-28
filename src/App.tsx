import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './index.css';

import Sidebar from './components/Sidebar/Sidebar';

import Home from './pages/home/Home';
import Compose from './pages/compose/Compose';
import Remix from './pages/remix/Remix';
import Login from './pages/login/Login';
import Settings from './pages/settings/Settings';

import Search from './pages/search/Search';
import SearchTag from './pages/SearchTag/SearchTag';
import SearchUser from './pages/SearchUser/SearchUser';
import SearchQuery from './pages/SearchQuery/SearchQuery'
import SearchAll from './pages/SearchAll/SearchAll';

import Profile from './pages/profile/Profile';
import JournalPopout from './components/JournalPopout/JournalPopout';


function App() {
    return (
    <div className="app">
        <Sidebar>
        <Routes>
                <Route path="/" element={<Home />}>
                    <Route path="/journal">
                        <Route index element={<Navigate to="/" />} />
                        <Route path=":journalId" element={<JournalPopout />} />
                    </Route>
                </Route>
                <Route path="/profile">
                    <Route index element={<Profile />} />
                    <Route path=":userId" element={<Profile />} />
                </Route>
                <Route path="/compose">
                    <Route index element={<Compose />} />
                    <Route path=":journalId" element={<Compose />} />
                </Route>
                <Route path="/remix">
                    <Route path=":journalId" element={<Remix />} />
                </Route>
                <Route path="/search">
                    <Route index element={<Search />} />
                    <Route path="/search/tag">
                        <Route index element={<Navigate to="/search" />} />
                        <Route path=":tag" element={<SearchTag />} />
                    </Route>
                    <Route path="/search/user">
                        <Route index element={<Navigate to="/search" />} />
                        <Route path=":username" element={<SearchUser />} />
                    </Route>
                    <Route path="/search/journal">
                        <Route index element={<Navigate to="/search" />} />
                        <Route path=":query" element={<SearchQuery />} />
                    </Route>
                    <Route path="/search/all">
                        <Route index element={<Navigate to="/search" />} />
                        <Route path=":query" element={<SearchAll />} />
                    </Route>
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </Sidebar>
    </div>
    );
}

export default App;
