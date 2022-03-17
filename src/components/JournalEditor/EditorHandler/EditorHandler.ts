import { FabricJSCanvas, FabricJSEditor } from 'fabricjs-react';
import { PSBrush, PSBrushIface } from "@arch-inc/fabricjs-psbrush";
import { fabric } from 'fabric';

import { Journal, API, RemixInfo } from '../../API/API';

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
    isDraft: boolean = false;
    remixInfo: RemixInfo = {
        "allow-remix": true,
        "is-remix": false,
        "original-journal-id": "0",
        remixes: 0,
        "remix-chain": 0
    };
    topics : string[] = [];
    title: string = 'Untitled Journal';

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

        this.editor.canvas.on("object:added", (e) => {
            if (!(e.target as any)?.undone && !(e.target as any)?.redone) {
                // Only update history on new items, not undone/redone items
                this.redoHistory = [];
                this.undoHistory.push({type: e.target?.type, target: e.target?.saveState()});
            }

            this.sortByOpacity();
            this.notify('update')
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


    // Drafts
    async loadDraft(draft : Journal, isRemix: boolean) {
        if (!this.editor) return;
        // something
        await new Promise((resolve) => this.editor.canvas.loadFromJSON(decodeURIComponent(draft.content.data), resolve))
        
        this.editor.canvas.setDimensions({width: 1240, height: 1754}); // A4 / 2
    }

    saveDraft() {
        const journal : Journal = {
            content: {data: encodeURIComponent(JSON.stringify(this.editor.canvas.toJSON()))},
            topics: this.topics,
            title: this.title || "Untitled Journal",
            remixInfo: this.remixInfo,
            visibility: this.visibility,
            isDraft: true
        }
        
        return API.uploadJournal(journal);
    }

    postJournal() {
        const journal : Journal = {
            content: {data: encodeURIComponent(JSON.stringify(this.editor.canvas.toJSON()))},
            topics: this.topics,
            title: this.title || "Untitled Journal",
            remixInfo: this.remixInfo,
            visibility: this.visibility,
            isDraft: false
        }
        
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
            brush.width = this.settings[tool].width / 2;
        } else {
            brush.pressureManager.fallback = this.settings[tool].width / 8;
            if (this.settings[tool].pressureSensitive) {
                brush.pressureManager.min = 0;
            } else {
                brush.pressureManager.min = 1;
            }
            brush.width = this.settings[tool].width / 2;
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