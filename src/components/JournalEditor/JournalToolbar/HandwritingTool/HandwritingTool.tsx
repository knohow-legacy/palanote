import React from 'react';
import HandwritingToolOverlay from './HandwritingToolOverlay';


// Creates a new handwriting tool
function HandwritingTool({title, tool, onClick, icon, isSelected, editorHandler} : any) {
    let [menuOpen, setMenuOpen] = React.useState(false);
    
    let menuToggleOnClick = (e:any) => {
        setMenuOpen(!menuOpen);
        onClick(e);
    }

    let closeWindow = (e:any) => {
        setMenuOpen(false);
    }

    React.useEffect(() => {
        function onClickOff() {
            if (menuOpen) {
                setMenuOpen(false);
            }
        }
        window.addEventListener('click', onClickOff);

        return () => {
            window.removeEventListener('click', onClickOff);
        }
    })

    return (
        <div title={title} className={"toolbarBtn" + (isSelected ? " active" : "")} onClick={menuToggleOnClick}>
            {icon}
            <HandwritingToolOverlay isOpen={isSelected && menuOpen} closeWindow={closeWindow} tool={tool} editorHandler={editorHandler} />
        </div>
    )
}

export default HandwritingTool;
