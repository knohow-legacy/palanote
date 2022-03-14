import React from 'react';
import './Dropdown.css';

// Creates a new handwriting tool
// items format:
/* {
    title: "",
    description: "",
    icon: <Icon />,
    key: "",
} 
*/
function Dropdown({title, onClick, items, isSelected, editorHandler} : any) {
    const [visibility, setVisibility] = React.useState(editorHandler.visibility);
    const [isOpened, setOpened] = React.useState(false);

    let selected = items.find((item:any) => item.key === visibility)

    const hideOpened = () => {setOpened(false)};
    React.useEffect(() => {
        window.addEventListener('click', hideOpened);
    
        // will run on cleanup
        return () => {
            window.removeEventListener('click', hideOpened);
        }
    })

    return (
        <div title={title} className={"dropdown" + (isOpened ? " opened" : "")} onClick={(e:any) => {setOpened(!isOpened); e.stopPropagation()}}>
            {
                <div
                    className="dropdownItem active"
                    key='active'
                >
                    {selected.icon}
                    <div className="dropdownItemText"><h3>{selected.title}</h3></div>
                </div>
            }
            <div className="dropdownItems">
                {items.map((item:any) => (
                    <div
                        className="dropdownItem"
                        key={item.key}
                        onClick={(e) => {
                            if (isOpened) {
                                onClick(editorHandler, item.key);
                                setVisibility(item.key);
                            }  
                        }}
                    >
                        {item.icon}
                        <div className="dropdownItemText">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Dropdown;
