import React from 'react';
import '../JournalEditor.css';
import { useQueryClient } from 'react-query';

import { Brush, Highlight, TextFields, HighlightAlt, Backspace, Add, Undo, Redo, Visibility, VisibilityOff, TouchApp, PanTool, DoNotTouch } from '@mui/icons-material';
import EditorHandler from '../EditorHandler/EditorHandler';
import Dropdown from './Dropdown/Dropdown';
import HandwritingTool from './HandwritingTool/HandwritingTool';
import TextTool from './TextTool/TextTool';

import Eraser from './eraser.svg';
import Highlighter from './highlighter.svg';
import Pen from './pen.svg';

const divider = {type: 'divider', props: {title: '', tool: '', icon: null, onClick: () => {}}};
const growableDivider = {type: 'growableDivider', props: {title: '', tool: '', icon: null, onClick: () => {}}};

const tools = [
    {
        type: 'button',
        props: {
            title: 'Select Tool',
            tool: 'select',
            icon: <HighlightAlt />,
            onClick: (editor: EditorHandler, setActiveTool : any, isLoading:boolean, setIsLoading:any) => {
                setActiveTool();
                editor.setTool('select');
            }
        }
    },
    divider,
    {
        type: 'HandwritingTool',
        props: {
            title: 'Pen Tool',
            tool: 'pen',
            icon: <img width="28" height="28" src={Pen} alt="Pen tool" />,
            onClick: (editor: EditorHandler, setActiveTool : any, isLoading:boolean, setIsLoading:any) => {
                setActiveTool();
                editor.setTool('pen');
            }
        }
    },
    {
        type: 'HandwritingTool',
        props: {
            title: 'Highlight Tool',
            tool: 'highlighter',
            icon: <img width="28" height="28" src={Highlighter} alt="Highlighter tool" />,
            onClick: (editor: EditorHandler, setActiveTool : any, isLoading:boolean, setIsLoading:any) => {
                setActiveTool();
                editor.setTool('highlighter');
            }
        }
    },
    {
        type: 'HandwritingTool',
        props: {
            title: 'Eraser Tool',
            tool: 'eraser',
            icon: <img width="28" height="28" src={Eraser} alt="Eraser tool" />,
            onClick: (editor: EditorHandler, setActiveTool : any, isLoading:boolean, setIsLoading:any) => {
                setActiveTool();
                editor.setTool('eraser');
            }
        }
    },
    divider,
    {
        type: 'TextTool',
        props: {
            title: 'Add Text',
            tool: 'text',
            icon: <TextFields />,
            onClick: (editor: EditorHandler, setActiveTool : any, isLoading:boolean, setIsLoading:any) => {
                setActiveTool();
                editor.setTool('text');
            }
        }
    },
    divider,
    {
        type: 'disablableButton',
        props: {
            isDisabled: (editor: EditorHandler) : boolean => {
                return !editor.hasUndoHistory();
            },
            title: 'Undo',
            tool: 'undo',
            icon: <Undo />,
            onClick: (editor: EditorHandler, setActiveTool : any, isLoading:boolean, setIsLoading:any) => {
                editor.undo();
            }
        }
    },
    {
        type: 'disablableButton',
        isDisabled: true,
        props: {
            isDisabled: (editor: EditorHandler) : boolean => {
                return !editor.hasRedoHistory();
            },
            title: 'Redo',
            tool: 'redo',
            icon: <Redo />,
            onClick: (editor: EditorHandler, setActiveTool : any, isLoading:boolean, setIsLoading:any) => {
                editor.redo();
            }
        }
    },
    growableDivider,
    {
        type: 'dropdown',
        props: {
            title: 'Enable touch',
            tool: 'touch',
            initial: (editor: EditorHandler) => editor.psBrush.disableTouch ? 'touch-disabled' : 'touch-enabled',
            items: [
                {
                    title: 'Draw',
                    description: 'Touches will be used for input',
                    icon: <PanTool />,
                    key: 'touch-enabled',
                },
                {
                    title: 'Scroll',
                    description: 'Touches will be used for scrolling',
                    icon: <DoNotTouch />,
                    key: 'touch-disabled',
                }
            ],
            icon: <PanTool />,
            onClick: (editor: EditorHandler, selectedKey: any, isLoading:boolean, setIsLoading:any) => {
                editor.psBrush.disableTouch = selectedKey === 'touch-disabled';
            }
        }
    },
    {
        type: 'dropdown',
        props: {
            title: 'Set visibility',
            tool: 'divider',
            initial: (editor: EditorHandler) => editor.visibility,
            items: [
                {
                    title: 'Public',
                    description: 'Everyone can see this journal',
                    icon: <Visibility />,
                    key: 'public',
                },
                {
                    title: 'Unlisted',
                    description: 'Only those with the link can view this journal',
                    icon: <Visibility />,
                    key: 'unlisted',
                },
                {
                    title: 'Private',
                    description: 'Only you can see this journal',
                    icon: <VisibilityOff />,
                    key: 'private',
                }
            ],
            icon: <Visibility />,
            onClick: (editor: EditorHandler, selectedKey: any, isLoading:boolean, setIsLoading:any) => {
                editor.setVisibility(selectedKey);
            }
        }
    },
    {
        type: 'postButton',
        props: {
            title: 'Post',
            tool: 'post',
            icon: <Add />,
            onClick: async (editor: EditorHandler, setActiveTool : any, isLoading:boolean, setIsLoading:any) => {
                setIsLoading(true);
                let resp = await editor.postJournal();

                if (resp.success) {
                    window.location.hash = `#/journal/${resp.journalID}`;
                } else {
                    alert("Error posting journal... try again?");
                    setIsLoading(false);
                }
            }
        }
    }
]

function JournalToolbar({editorHandler, isLoading, setIsLoading} : {editorHandler : EditorHandler, isLoading : boolean, setIsLoading : any}) {
    const [activeTool, setActiveTool] : [number, any] = React.useState(0);
    const [updateParam, update] = React.useState(false);
    let queryClient = useQueryClient()

    let location = window.location.hash.split('compose/')[1];
    if (location && queryClient.getQueryData(['journal', location])) {
        queryClient.invalidateQueries(['journal', location]);
    }

    const forceUpdate = () => {update(!updateParam)}
    editorHandler.setListener('update', forceUpdate);

    function onPaste(e:any) {
        e.preventDefault();
        let text = e.clipboardData.getData("text/plain");
        editorHandler?.pasteSelection(text);
    }

    function keyUp(e:any) {
        if (e.target instanceof HTMLInputElement) return;

        // auto textbox
        if (!e.ctrlKey && ((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 48 && e.keyCode <= 57))) {
            let textToolIndex = tools.findIndex(tool => tool.type === 'TextTool');
            if (activeTool !== textToolIndex) {
                setActiveTool(textToolIndex);
                editorHandler?.setTool('text');
            }

            if (!editorHandler?.editor.canvas.getActiveObject() ||
                editorHandler?.editor.canvas.getActiveObject().type !== 'textbox') {
                editorHandler?.addText(String.fromCharCode(e.keyCode));
            }
        }

        if (e.keyCode === 46 || e.keyCode === 8) { // Delete
            editorHandler?.deleteSelection();
            
        } else if (e.keyCode === 27) { // Escape
            setActiveTool(0);
            editorHandler?.setTool('select');
        }

        if (e.ctrlKey) {
            switch(e.key) {
                case 'z':
                    editorHandler?.undo();
                    break;
                case 'y':
                    editorHandler?.redo();
                    break;
                case 'a':
                    editorHandler?.selectAll();
                    e.stopPropagation();
                    break;
                case 'c':
                    editorHandler?.copySelection();
                    break;
                case 'x':
                    editorHandler?.cutSelection();
                    break;
            }
        }
        
    }

    React.useEffect(() => {
        window.addEventListener('keyup', keyUp)
        window.addEventListener('paste', onPaste);
    
        // will run on cleanup
        return () => {
            window.removeEventListener('keyup', keyUp)
            window.removeEventListener('paste', onPaste);
        }
    })

    const toolbar = tools.map((tool, index) => {
        switch(tool.type) {
            case 'divider':
                return <div key={`divider-${index}`} className="divider" />;
            case 'growableDivider':
                return <div key={`divider-${index}`} className="growableDivider" />
            case 'button':
                return (
                    <div
                        key={tool.props.tool}
                        title={tool.props.title}
                        className={"toolbarBtn" + (activeTool === index ? " active" : "")}
                        onClick={(e) => {
                            (e.currentTarget as HTMLElement).blur();
                            tool.props.onClick(editorHandler, () => {setActiveTool(index)}, isLoading, setIsLoading)
                        }}>
                        {tool.props.icon}
                    </div>
                );
            case 'disablableButton':
                return (
                    <div
                        key={tool.props.tool}
                        title={tool.props.title}
                        className={"toolbarBtn" + ((tool as any).props.isDisabled(editorHandler) ? " disabled" : "")}
                        onClick={(e) => {
                            (e.currentTarget as HTMLElement).blur();
                            if (!(tool as any).props.isDisabled(editorHandler)) {
                                tool.props.onClick(editorHandler, () => {setActiveTool(index)}, isLoading, setIsLoading)
                            }
                            forceUpdate();
                        }}>
                        {tool.props.icon}
                    </div>
                );
            case 'postButton':
                return (
                    <div
                        key={tool.props.tool}
                        title={tool.props.title}
                        className="toolbarBtn postBtn"
                        onClick={() => {
                            tool.props.onClick(editorHandler, () => {setActiveTool(index)}, isLoading, setIsLoading)
                        }}>
                        {tool.props.icon}
                        <span>{editorHandler.isRemix ? 'Remix' : editorHandler.draft ? 'Update' : 'Post'}</span>
                    </div>
                );
            case 'HandwritingTool':
                return (
                    <HandwritingTool
                        key={tool.props.tool}
                        isSelected={activeTool === index}
                        editorHandler={editorHandler}
                        {...tool.props}
                        onClick={(e : any) => {
                            (e.target as HTMLElement).blur();
                            tool.props.onClick(editorHandler, () => {setActiveTool(index)}, isLoading, setIsLoading)
                        }}
                    />
                );
            case 'TextTool':
                return (
                    <TextTool
                        key={tool.props.tool}
                        isSelected={activeTool === index}
                        editorHandler={editorHandler}
                        {...tool.props}
                        onClick={(e : any) => {
                            (e.target as HTMLElement).blur();
                            tool.props.onClick(editorHandler, () => {setActiveTool(index)}, isLoading, setIsLoading)
                        }}
                    />
                );
            case 'dropdown':
                return (
                    <Dropdown 
                        key={tool.props.tool}
                        editorHandler={editorHandler}
                        {...tool.props}
                    />
                )
        }
    });

    return (<div className="journalToolbar">{toolbar}</div>)
}

export default JournalToolbar;
