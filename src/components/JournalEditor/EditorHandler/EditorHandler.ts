import { FabricJSEditor } from '../../../fabricjs-react/index';
import { PSBrush, PSBrushIface } from "@arch-inc/fabricjs-psbrush";
import { fabric } from 'fabric';

import { Journal, API, RemixInfo, PublishedJournal } from '../../API/API';

/*
Fabric typings apparently don't support EraseBrush (a module, see npm run-script postinstall),
so there's a lot of type overriding here...
*/

interface BrushSettings {
    width: number;
    color: string;
    opacity: number; // Determines the opacity
    pressureSensitive: boolean; // Determines if pressure sensitivity is enabled (iPad)
    removesFullStrokes: boolean; // Determines if the brush should remove full strokes
}
interface BrushSettingsOptions {
    width?: number;
    color?: string;
    opacity?: number; // Determines the opacity
    pressureSensitive?: boolean; // Determines if pressure sensitivity is enabled (iPad)
    removesFullStrokes?: boolean;
}
type Tool = 'select' | 'pen' | 'highlighter' | 'eraser' | 'text';
type BrushTool = 'pen' | 'highlighter' | 'eraser';

type Events = 'undo' | 'redo' | 'update';

export default class EditorHandler {
    editor : FabricJSEditor;

    psBrush : PSBrushIface;
    eraseBrush : fabric.BaseBrush;

    // Undo/Redo History
    undoHistory: any[] = [];
    redoHistory: any[] = [];

    // Listeners
    listeners: {[event: string]: Function} = {
        'undo': () => {},
        'redo': () => {},
        'update': () => {}
    };

    visibility: 'public' | 'unlisted' | 'private' = 'public';
    draft: null | PublishedJournal = null;
    isRemix = false;

    remixInfo: RemixInfo = {
        "allow-remix": true,
        "is-remix": false,
        "original-journal-id": "0",
        "remixes": 0,
        "remix-chain": 0
    };
    topics : string[] = [];
    title: string = '';

    currentTool : Tool = 'select';
    settings : {[key:string]:BrushSettings} = {
        pen: {
            width: 5,
            color: '#000000',
            opacity: 1,
            pressureSensitive: true,
            removesFullStrokes: false
        },
        highlighter: {
            width: 10,
            color: '#ffeb3b',
            opacity: 0.5,
            pressureSensitive: false,
            removesFullStrokes: false
        },
        eraser: {
            width: 10,
            color: '#ffffff',
            opacity: 1,
            pressureSensitive: false,
            removesFullStrokes: true
        }
    };

    // Sort objects by opacity (highlights behind strokes)
    sortByOpacity() {
        this.editor.canvas._objects.sort((a:any, b:any) => {
            return a.opacity - b.opacity;
        });
    }

    constructor(editor : FabricJSEditor) {
        this.editor = editor;
        this.psBrush = new PSBrush(editor.canvas);
        this.eraseBrush = new (fabric as any).EraserBrush(editor.canvas);

        this.editor.canvas.freeDrawingBrush = this.psBrush;
        this.editor.canvas.uniformScaling = true;

        this.editor.canvas.on("object:added", ({target} : any) => {
            if (target && !target.undone && !target.redone) {
                // Only update history on new items, not undone/redone items
                this.redoHistory = [];
                this.undoHistory.push({type: target.type, target: target.saveState()});
                
                // remove old items after a while
                if (this.undoHistory.length > 100) this.undoHistory.shift();
            }

            this.sortByOpacity();
            this.notify('update')
        })

        this.editor.canvas.on("object:modified", ({e, action, transform, target}:any) => {
            target._objects.forEach((obj:any) => {
                if (obj.remixed && !obj.modified) {
                    console.log(obj.opacity)
                    obj.opacity = obj.opacity * 2;
                    obj['modified'] = true;
                }
            })
        })

        this.editor.canvas.on("erasing:end", ({targets, drawables}:any) => {
            // TODO: find a better way to get bounding boxes of lines (not rectangles!)
            if(this.currentTool === 'eraser') {
                this.redoHistory = [];

                if (this.settings[this.currentTool].removesFullStrokes) {
                    this.undoHistory.push({type: 'eraseFull', target: targets.map((t:any) => t.saveState())});
                    targets.forEach((obj:any) => this.editor.canvas.remove(obj));
                } else {
                    this.undoHistory.push({type: 'erasePartial', target: targets.map((t:any) => t.saveState())});
                }
            }
            this.notify('update')
        })
    }

    // Listeners
    setListener(event: Events, callback: () => void) {
        this.listeners[event] = callback;
    }

    notify(event: Events) {
        this.listeners[event]();
    }


    // Loads a draft
    async loadDraft(draft : PublishedJournal, isRemix: boolean) {
        if (!this.editor) return;
        this.draft = draft;
        this.isRemix = isRemix;
        this.setVisibility(draft.visibility);
        this.editor.canvas.setDimensions({width: 1240, height: 1754});

        if (isRemix) {
            this.remixInfo['original-journal-id'] = draft.id;
            this.remixInfo['allow-remix'] = true;
            this.remixInfo['is-remix'] = true;
            this.remixInfo.remixes = 0;
            this.remixInfo['remix-chain']++;
        }

        // load
        await new Promise<void>((resolve) => {
            this.editor.canvas.loadFromJSON(decodeURIComponent(draft.content.data), () => resolve(), (o:any, object:any) => {
                console.log(object);
                if (isRemix) {
                    object['remixed'] = true;
                    object.opacity = object.opacity / 2;
                }
            })
        })
        
        this.editor.canvas.renderAll();
        (this.editor.canvas as any).setCurrentDimensions();

        // clear histories added during load
        this.undoHistory = [];
        this.redoHistory = [];
        this.notify('update');
        
        //this.editor.canvas.setDimensions({width: 1240, height: 1754}); // A4 / 2
    }

    saveDraft() : Promise<{success: false} | {success: true; journalID: string}> {
        if (!this.draft) return this.postJournal();

        const journal : any = {
            id: this.draft.id,
            content: {
                data: encodeURIComponent(JSON.stringify(this.editor.canvas.toJSON())),
                svg: encodeURIComponent(this.editor.canvas.toSVG())
            },
            topics: this.topics,
            title: this.title || ((this.draft && this.isRemix) ? ("Remix of " + this.draft.title) : "Untitled Journal"),
            remixInfo: this.remixInfo,
            visibility: this.visibility,
            isDraft: this.draft.isDraft
        }
        
        return API.patchJournal(journal);
    }

    postJournal() : Promise<{success: false} | {success: true; journalID: string}> {
        if (!this.isRemix && this.draft) return this.saveDraft();

        // scale journal properly (width: 1240)
        const width = this.editor.canvas.getWidth();
        const height = this.editor.canvas.getHeight();
        const targetWidth = 1240;


        this.editor.canvas._objects.forEach((obj:any) => {
            if (obj['remixed'] && !obj['modified']) {
                obj.opacity = (obj.opacity || 0.5) * 2;
            }

            obj.scaleX /= (width / (targetWidth || 1))
            obj.scaleY /= (width / (targetWidth || 1))
            obj.left /= (width / (targetWidth || 1))
            obj.top /= (width / (targetWidth || 1))
            obj.setCoords();
        })
        this.editor.canvas.setDimensions({width: targetWidth, height: height / (width / (targetWidth || 1))}); // A4 / 2

        const journal : Journal = {
            content: {
                data: encodeURIComponent(JSON.stringify(this.editor.canvas.toJSON())),
                svg: encodeURIComponent(this.editor.canvas.toSVG())
            },
            topics: this.topics,
            title: this.title || ((this.draft && this.isRemix) ? ("Remix of " + this.draft.title) : "Untitled Journal"),
            remixInfo: this.remixInfo,
            visibility: this.visibility,
            isDraft: false
        }
        
        // If draft but not remix, update it instead of making a new object
        return API.uploadJournal(journal);
    }

    updateToolSettings(tool: BrushTool | null, settings: BrushSettingsOptions) {
        if (!tool) tool = this.currentTool as BrushTool;
        
        if (!this.settings[tool]) return; // not a valid tool

        Object.assign(this.settings[tool], settings);
        this.applyToolSettings(tool);
    }

    applyToolSettings(tool: BrushTool) {
        let brush : any = tool === 'eraser' ? this.eraseBrush : this.psBrush;
        if (tool === 'eraser') {
            brush.width = this.settings[tool].width;
        } else {
            brush.pressureManager.fallback = this.settings[tool].width / 4;
            if (this.settings[tool].pressureSensitive) {
                brush.pressureManager.min = 0;
            } else {
                brush.pressureManager.min = 1;
            }
            brush.width = this.settings[tool].width;
            brush.color = this.settings[tool].color;
            brush.opacity = this.settings[tool].opacity;
        }
        this.editor.canvas.freeDrawingBrush = brush;
    }

    setTool(tool : Tool) {
        
        this.currentTool = tool;
        if (['pen', 'highlighter', 'eraser'].includes(tool)) {
            this.editor.canvas.isDrawingMode = true;
            this.applyToolSettings(tool as BrushTool);
        } else {
            this.editor.canvas.isDrawingMode = false;
        }
    }

    setVisibility(visibility: 'public' | 'unlisted' | 'private') {
        this.visibility = visibility;
    }

    setTitle(title: string) {
        this.title = title;
    }

    setTags(tags: string[]) {
        this.topics = tags;
    }

    // UNDO / REDO

    hasUndoHistory() {
        return this.undoHistory.length > 0;
    }
    hasRedoHistory() {
        return this.redoHistory.length > 0;
    }

    undo() {
        let undo = this.undoHistory.pop();
        if (undo) {
            switch(undo.type) {
                case 'erasePartial':
                    this.redoHistory.push({
                        type: 'erasePartial',
                        target: undo.target.map((obj:any) => {
                            let erasePath = obj.clipPath._objects[obj.clipPath._objects.length - 1].saveState();
                            
                            console.log(obj.clipPath)
                            if (obj.clipPath._objects.length > 2) {
                                obj.clipPath.removeWithUpdate(erasePath);
                                obj.clipPath.dirty = true;
                            } else {
                                obj.clipPath = null;
                            }
                            
                            this.editor.canvas.remove(erasePath)

                            obj.dirty = true;

                            return {target: obj, erasePath};
                        })
                    })
                    break;
                case 'eraseFull':
                    this.redoHistory.push({
                        type: 'eraseFull',
                        target: undo.target.map((obj:any) => {
                            // Fabric filters out ".undone", so add custom properties like this
                            obj['undone'] = true;
                            
                            // Remove the clip path that was used to erase this object (still added even with full eraser)
                            if (obj.clipPath && obj.clipPath._objects.length > 2) {
                                obj.clipPath.removeWithUpdate(obj.clipPath._objects[obj.clipPath._objects.length - 1]);
                            } else {
                                // if only line and mask, remove everything
                                obj.clipPath = null;
                            }
                            
                            this.editor.canvas.add(obj);
                            return {target: obj};
                        })
                    })
                    break;
                default:
                    // Stroke was added
                    this.editor.canvas.remove(undo.target);
                    this.redoHistory.push(undo);
            }
            
            this.editor.canvas.renderAll();
        }
        this.notify('undo');
    }

    redo() {
        let redo = this.redoHistory.pop();
        if (redo) {
            switch(redo.type) {
                case 'erasePartial':
                    this.undoHistory.push({
                        type: 'erasePartial',
                        target: redo.target.map((obj:any) => {
                            // Add the clip path back
                            console.log(obj.target)
                            if (obj.target.clipPath) {
                                obj.target.clipPath.addWithUpdate(obj.erasePath);
                            } else {
                                // Recreate the group created by the Eraser - MAY NOT BE 100% ACCURATE, causes clipping?
                                obj.target.clipPath = new fabric.Group([
                                    new fabric.Rect({
                                        left: 0,
                                        top: 0,
                                        width: obj.target.width,
                                        height: obj.target.height,
                                        fill: 'rgb(0,0,0)',
                                        originX: 'center',
                                        originY: 'center'
                                    }),
                                    obj.erasePath
                                ]);
                            }
                            

                            obj.target.dirty = true;

                            return obj.target;
                        })
                    })
                    break;
                case 'eraseFull':
                    this.undoHistory.push({
                        type: 'eraseFull',
                        target: redo.target.map((obj:any) => {
                            // Fabric filters out ".undone", so add custom properties like this
                            this.editor.canvas.remove(obj.target);
                            return obj.target;
                        })
                    })
                    break;
                default:
                    // Stroke was removed by undo
                    redo.target['redone'] = true;
                    this.editor.canvas.add(redo.target);
                    this.undoHistory.push(redo);
            }
            
            this.editor.canvas.renderAll();
        }
        this.notify('undo');
    }
}