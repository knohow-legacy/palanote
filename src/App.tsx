import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import './index.css';

import Sidebar from './components/Sidebar/Sidebar';

import Home from './pages/home/Home';
import Compose from './pages/compose/Compose';
import Login from './pages/login/Login';
import Settings from './pages/settings/Settings';
import Search from './pages/search/Search';
import SearchTag from './pages/SearchTag/SearchTag';
import Profile from './pages/profile/Profile';
import JournalPage from './pages/journal/JournalPage';

const queryClient = new QueryClient();

function App() {
    return (
    <div className="app">
        <QueryClientProvider client={queryClient}>
            <Router basename="/postit">
                <Sidebar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/compose" element={<Compose />} />
                    <Route path="/search">
                        <Route index element={<Search />} />
                        <Route path="/search/tag">
                            <Route index element={<Navigate to="/search" />} />
                            <Route path=":tag" element={<SearchTag />} />
                        </Route>
                    </Route>
                    <Route path="/login" element={<Login />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile">
                        <Route index element={<Profile />} />
                        <Route path=":userId" element={<Profile />} />
                    </Route>
                    <Route path="/journal">
                        <Route index element={<Navigate to="/" />} />
                        <Route path=":journalId" element={<JournalPage />} />
                    </Route>
                </Routes>
            </Router>
        </QueryClientProvider>
    </div>
    );
}

export default App;
