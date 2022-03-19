import React from 'react';
import { NavLink } from 'react-router-dom';
import './ContextMenu.css';

/* {
    label: 'Dropdown label,
    icon: <Icon />,
    className: 'danger',
    onClick: () => {}
} */
function ContextMenu({title, children, items, direction} : {title: string, children?:any, direction: 'up-left' | 'up-right' | 'down-left' | 'down-right', items: Array<{onClick: any, className?: string, href?: string, label: string, icon: any}>}) {
    const [isOpened, setIsOpened] = React.useState(false);

    let contextStyles = {};
    switch(direction) {
        case 'up-left':
            contextStyles = {bottom: '100%', right: 0};
            break;
        case 'up-right':
            contextStyles = {bottom: '100%', left: 0};
            break;
        case 'down-left':
            contextStyles = {top: '100%', right: 0};
            break;
        case 'down-right':
            contextStyles = {top: '100%', left: 0};
            break;
    }
    
    return (
        <div className={"contextMenu" + (direction.includes('up') ? ' up' : ' down') + (isOpened ? ' opened' : '')} onClick={(e) => {setIsOpened(!isOpened); e.stopPropagation()}}>
            {children}
            <div className="contextMenuItems" style={contextStyles}>
                {
                    items.map((item, index) => {
                        if (item.href) {
                            return (
                                <NavLink to={item.href} onClick={item.onClick} key={index} title={item.label} className={"contextMenuItem" + (item.className ? (" " + item.className) : "")}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        }
                        return (
                            <div onClick={item.onClick} key={index} title={item.label} className={"contextMenuItem" + (item.className ? (" " + item.className) : "")}>
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default ContextMenu;
