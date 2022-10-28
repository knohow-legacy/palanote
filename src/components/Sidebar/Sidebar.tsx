import React from 'react';
import './Sidebar.css';
import { Add, Search, Home, Person, CloseFullscreen, OpenInFull, Login, Settings } from '@mui/icons-material';
import { NavLink, useLocation } from "react-router-dom";

import { Authentication } from '../Authentication/Authentication';

const sideBarItems = [
    {
        name: 'Home',
        icon: <Home />,
        path: '/',
        class: 'item',
        requiresLogin: true
    },
    {
        name: 'Search',
        icon: <Search />,
        path: '/search',
        class: 'item',
        requiresLogin: false
    },
    {
        name: 'Profile',
        icon: <Person />,
        path: '/profile',
        class: 'item',
        requiresLogin: true
    },
    {
        name: 'Journal',
        icon: <Add />,
        path: '/compose',
        class: 'item postBtn',
        requiresLogin: true
    }
]

function Sidebar({children} : {children: any}) {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [isMinimized, setMinimized] = React.useState(window.localStorage.getItem('sideBarMinimized') === 'true');
    const location = useLocation();

    // change active index when location updates
    React.useEffect(() => {
        const curPath = location.pathname.split('/')[1];
        const activeItem = sideBarItems.findIndex(item => item.path.substring(1) === curPath);
        setActiveIndex(curPath.length === 0 ? 0 : activeItem);
    }, [location]);

    // Need an outer div for flexbox, and then the inner div for sticky support
    return (
        <>
            <div className="sidebar-wrapper">
                <div className={"sidebar" + (isMinimized ? " minimized" : "")}>
                    <NavLink to="/" className="brandHome">
                        <h1>PalaNote</h1>
                    </NavLink>
                    {
                        sideBarItems.map((item, index) => {
                            if (!Authentication.isLoggedIn && item.requiresLogin) return '';
                            return (
                                <NavLink onClick={(e) => {window.scrollTo(0,0)}} className={item.class + (activeIndex === index ? ' active' : '')} to={item.path} key={index}>
                                    {item.icon}
                                    <span>{item.name}</span>
                                </NavLink>
                            )
                        })
                    }
                    {!Authentication.isLoggedIn && (
                        <NavLink className={'item' + (activeIndex === 98 ? ' active' : '')} to="/login" key={98}>
                            <Login />
                            <span>Login</span>
                        </NavLink>
                    )}
                    {Authentication.isLoggedIn && (
                        <NavLink className={'item' + (activeIndex === 99 ? ' active' : '')} to="/settings" key={99}>
                            <Settings />
                            <span>Settings</span>
                        </NavLink>
                    )}
                    <div onClick={() => {window.localStorage.setItem('sideBarMinimized', (!isMinimized).toString()); setMinimized(!isMinimized)}} className="item minimizeBtn">
                        {isMinimized ? <OpenInFull /> : <CloseFullscreen />}
                        <span>Minimize</span>
                    </div>
                    
                </div>
            </div>
            {children}
            <div className={"sidebar" + (isMinimized ? " minimized" : "")} style={{zIndex: '-1', borderLeft: '1px solid #ccc'}} />
        </>
    );
}

export default Sidebar;
