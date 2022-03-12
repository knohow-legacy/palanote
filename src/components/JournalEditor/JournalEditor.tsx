import React from 'react';
import './JournalEditor.css';

import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';

import JournalToolbar from './JournalToolbar/JournalToolbar';
import EditorHandler from './EditorHandler/EditorHandler';

function JournalEditor({draft} : {draft? : any}) {
    let { editor, onReady } : any = useFabricJSEditor();
    const ref : any = React.useRef(null);

    function resizeCanvas() {
        if (!editor || !ref.current || !ref.current.clientWidth) return;
        const ratio = editor.canvas.getWidth() / editor.canvas.getHeight();
        const containerWidth = ref.current.clientWidth;
        const scale = containerWidth / editor.canvas.getWidth();
        const zoom  = editor.canvas.getZoom() * scale;
    
        editor.canvas.setDimensions({width: containerWidth, height: containerWidth / ratio});
        editor.canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
    }
    
    let editorHandler = undefined;
    if (editor) {
        editorHandler = new EditorHandler(editor);
        if (draft) {
            editorHandler.loadDraft(draft);
        } else {
            editor.canvas.setDimensions({width: 500, height: 1000});
        }
        resizeCanvas();
    }

    React.useEffect(() => {
        window.addEventListener('resize', resizeCanvas)
    
        // will run on cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas)
        }
    })
    

    return (
        <div ref={ref} className="journalEditor">
            <JournalToolbar editorHandler={editorHandler} />
            <FabricJSCanvas className="journalCanvas" onReady={onReady} />
        </div>
    );
}

export default JournalEditor;
