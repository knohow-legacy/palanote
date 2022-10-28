import React from 'react';
import './JournalEditor.css';

import { FabricJSCanvas, useFabricJSEditor } from '../../fabricjs-react/index';

import JournalToolbar from './JournalToolbar/JournalToolbar';
import EditorHandler from './EditorHandler/EditorHandler';
import Loading from '../Loading/Loading';

function JournalEditor({titleRef, tags, draft=null, isRemix=false} : {titleRef : any, tags : any, draft? : any, isRemix : boolean}) {
    let { editor, onReady } : any = useFabricJSEditor();
    let [editorHandler, setEditorHandler] = React.useState<EditorHandler | null>(null);
    let [isLoading, setIsLoading] = React.useState(false);
    let [touchOffset, setTouchOffset] = React.useState<false|[number, number]>(false);
    const ref : any = React.useRef(null);

    function keyUp(e:any) {
        editorHandler?.setTitle(e.target.value);
    }

    editorHandler?.setTags(tags);

    React.useEffect(() => {
        let ref = titleRef.current;
        ref.addEventListener('keyup', keyUp)
    
        // will run on cleanup
        return () => {
            ref.removeEventListener('keyup', keyUp)
        }
    })

    if (editor && !editorHandler) {
        let editorHandler = new EditorHandler(editor);

        //inputRef.current.removeEventListener('keyup', saveTitle);
        //inputRef.current.addEventListener('keyup', saveTitle);
        
        if (draft) {
            editorHandler.loadDraft(draft, isRemix);
        }

        setEditorHandler(editorHandler);
    }

    // Handle scrolling ----
    function handleScroll(e:any) {
        if (editorHandler && editorHandler.psBrush.disableTouch) {
            let scroll = (e.touches ? e.touches[0].clientY : e.clientY);
            if (e.touches && e.touches[0].touchType === 'stylus') return;
        
            if (e.type === 'touchstart' || e.type === 'mousedown') {
                setTouchOffset([ref.current.scrollTop, scroll]);
            } else if (e.type === 'touchend' || e.type === 'mouseup') {
                setTouchOffset(false);
            } else if (touchOffset !== false) {
                ref.current.scrollTop = touchOffset[0] + (touchOffset[1] - scroll);
            }
        }
    }

    

    return (
        <div
            ref={ref}
            className="journalEditor"
            onTouchStart={handleScroll}
            onTouchMove={handleScroll}
            onTouchEnd={handleScroll}
            onTouchCancel={handleScroll}
        >
            <div className="screenTooSmall"><h2>Your screen is too small to write notes.</h2><p>Writing journals is only supported on desktop and tablet devices.</p></div>
            {isLoading && (<Loading />)}
            {editorHandler && <JournalToolbar isLoading={isLoading} setIsLoading={setIsLoading} editorHandler={editorHandler} />}
            <FabricJSCanvas dimensions={{width: 1240, height: 1754}} className="journalCanvas" onReady={onReady} />
        </div>
    );
}

export default JournalEditor;
