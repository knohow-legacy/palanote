import React from 'react';
import './Sidebar.css';
import { Add, Search, Home, Person, CloseFullscreen, OpenInFull } from '@mui/icons-material';
import { NavLink, useLocation } from "react-router-dom"; 

const sideBarItems = [
    {
        name: 'Home',
        icon: <Home />,
        path: '/',
        class: 'item'
    },
    {
        name: 'Search',
        icon: <Search />,
        path: '/search',
        class: 'item'
    },
    {
        name: 'Profile',
        icon: <Person />,
        path: '/profile',
        class: 'item'
    },
    {
        name: 'Journal',
        icon: <Add />,
        path: '/compose',
        class: 'item postBtn'
    }
]

function Sidebar() {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [isMinimized, setMinimized] = React.useState(window.localStorage.getItem('sideBarMinimized') === 'true');
    const location = useLocation();

    // change active index when location updates
    React.useEffect(() => {
        const curPath = window.location.pathname.split('/')[1];
        const activeItem = sideBarItems.findIndex(item => item.path.substring(1) === curPath);
        setActiveIndex(curPath.length === 0 ? 0 : activeItem);
    }, [location]);

    // Need an outer div for flexbox, and then the inner div for sticky support
    return (
        <div>
            <div className={"sidebar" + (isMinimized ? " minimized" : "")}>
                <NavLink to="/" className="brandHome">
                    <h1>PostIt</h1>
                </NavLink>
                {
                    sideBarItems.map((item, index) => {
                        return (
                            <NavLink className={item.class + (activeIndex === index ? ' active' : '')} to={item.path} key={index}>
                                {item.icon}
                                <span>{item.name}</span>
                            </NavLink>
                        )
                    })
                }
                <div onClick={() => {window.localStorage.setItem('sideBarMinimized', (!isMinimized).toString()); setMinimized(!isMinimized)}} className="item minimizeBtn">
                    {isMinimized ? <OpenInFull /> : <CloseFullscreen />}
                    <span>Minimize</span>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
