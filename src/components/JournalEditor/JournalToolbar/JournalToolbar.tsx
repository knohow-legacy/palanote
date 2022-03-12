import React from 'react';
import '../JournalEditor.css';

import { Brush, Highlight, TextFields, HighlightAlt, Backspace, LineWeight, Add, Visibility } from '@mui/icons-material';
import EditorHandler from '../EditorHandler/EditorHandler';

const divider = {title: '', type: 'divider', icon: null, onClick: () => {}};

// TODO: make this a lot more extensible!!
const tools = [
    {
        title: 'Select Tool',
        type: 'button',
        icon: <HighlightAlt />,
        onClick: (editor: EditorHandler, setActiveTool : any) => {
            setActiveTool();
            editor.setTool('select');
        }
    },
    divider,
    {
        title: 'Pen Tool',
        type: 'button',
        icon: <Brush />,
        onClick: (editor: EditorHandler, setActiveTool : any) => {
            setActiveTool();
            editor.setTool('pen');
        }
    },
    {
        title: 'Highlight Tool',
        type: 'button',
        icon: <Highlight />,
        onClick: (editor: EditorHandler, setActiveTool : any) => {
            setActiveTool();
            editor.setTool('highlighter');
        }
    },
    {
        title: 'Eraser Tool',
        type: 'button',
        icon: <Backspace />,
        onClick: (editor: EditorHandler, setActiveTool : any) => {
            setActiveTool();
            editor.setTool('eraser');
        }
    },
    {
        title: 'Adjust size',
        type: 'input',
        icon: <LineWeight />,
        input: {
            type: 'range',
            min: 1,
            max: 20,
            defaultValue: 2,
            id: 'sizeSlider'
        },
        onClick: (editor: EditorHandler, setActiveTool : any, target : any) => {
            editor.updateToolSettings(null, {width: parseInt(target.value)});
            
        }
    },
    divider,
    {
        title: 'Add Text',
        type: 'button',
        icon: <TextFields />,
        onClick: (editor: EditorHandler, setActiveTool : any ) => {
            setActiveTool();
            editor.setTool('text');
        }
    },
    divider,
    {
        title: 'Adjust visibility',
        type: 'button',
        icon: <div className="visibilityDropdown"><Visibility /><span>Public</span></div>,
        onClick: (editor: EditorHandler, setActiveTool : any, target : any) => {
            
        }
    },
    {
        title: 'Post',
        type: 'button',
        icon: <div className="postBtn"><Add /><span>Post</span></div>,
        onClick: (editor: EditorHandler, setActiveTool : any ) => {}
    }
]


function JournalToolbar({editorHandler} : {editorHandler : EditorHandler | undefined}) {
    const [activeTool, setActiveTool] : [number, any] = React.useState(0);

    if (editorHandler) {
        return (
            <div className="journalToolbar">
                {tools.map((tool, index) => {
                    if (tool.title === 'DIVIDER') {
                        return <div className="divider" />;
                    }
                    switch(tool.type) {
                        case 'divider':
                            return <div className="divider" />;
                        case 'button':
                            return (
                                <div
                                    title={tool.title}
                                    className={"toolbarBtn" + (activeTool === index ? " active" : "")}
                                    onClick={(e) => {
                                        (e.target as HTMLElement).blur();
                                        tool.onClick(editorHandler, () => {setActiveTool(index)}, e.target)
                                    }}>
                                    {tool.icon}
                                </div>
                            );
                        case 'input':
                            return (
                                <div title={tool.title} className="toolbarInput">
                                    {tool.icon}
                                    <input 
                                        onClick={(e) => {
                                            (e.target as HTMLElement).blur();
                                            tool.onClick(editorHandler, () => {setActiveTool(index)}, e.target)
                                        }}
                                        {...(tool as any).input}
                                    />
                                </div>
                            )
                    }
                })}
            </div>
        );
    }
    return (
        <div className="journalToolbar">
            {tools.map((tool, index) => {
                if (tool.title === 'DIVIDER') {
                    return <div className="divider" />;
                }
                switch(tool.type) {
                    case 'divider':
                        return <div className="divider" />;
                    case 'button':
                        return (
                            <div
                                title={tool.title}
                                className="toolbarBtn disabled">
                                {tool.icon}
                            </div>
                        );
                    case 'input':
                        return (
                            <div title={tool.title} className="toolbarInput disabled">
                                {tool.icon}
                                <input {...(tool as any).input} />
                            </div>
                        )
                }
            })}
        </div>
    );
}

export default JournalToolbar;
