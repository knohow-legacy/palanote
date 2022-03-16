import React from 'react';
import HandwritingToolOverlay from './HandwritingToolOverlay';


// Creates a new handwriting tool
function HandwritingTool({title, tool, onClick, icon, isSelected, editorHandler} : any) {
    let [menuOpen, setMenuOpen] = React.useState(true);
    
    let menuToggleOnClick = (e:any) => {
        if (isSelected) {
            setMenuOpen(!menuOpen);
        }
        onClick(e);
    }

    return (
        <div title={title} className={"toolbarBtn" + (isSelected ? " active" : "")} onClick={menuToggleOnClick}>
            {icon}
            {isSelected && menuOpen && <HandwritingToolOverlay tool={tool} editorHandler={editorHandler} />}
        </div>
    )
}

export default HandwritingTool;
