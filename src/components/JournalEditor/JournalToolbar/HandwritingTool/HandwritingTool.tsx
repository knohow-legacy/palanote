import React from 'react';
import HandwritingToolOverlay from './HandwritingToolOverlay';


// Creates a new handwriting tool
function HandwritingTool({title, tool, onClick, icon, isSelected, editorHandler} : any) {
    return (
        <div title={title} className={"toolbarBtn" + (isSelected ? " active" : "")} onClick={onClick}>
            {icon}
            {isSelected && <HandwritingToolOverlay tool={tool} editorHandler={editorHandler} />}
        </div>
    )
}

export default HandwritingTool;
