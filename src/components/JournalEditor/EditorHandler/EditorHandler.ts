import { FabricJSEditor } from 'fabricjs-react';
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

export default class EditorHandler {
    editor : FabricJSEditor;

    psBrush : PSBrushIface;
    eraseBrush : fabric.BaseBrush;

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

    constructor(editor : FabricJSEditor) {
        this.editor = editor;
        this.psBrush = new PSBrush(editor.canvas);
        this.eraseBrush = new (fabric as any).EraserBrush(editor.canvas);

        this.editor.canvas.freeDrawingBrush = this.psBrush;

        this.editor.canvas.on("erasing:end", ({targets, drawables}:any) => {
            // TODO: find a better way to get bounding boxes of lines (not rectanges!)
            if(this.currentTool === 'eraser' && this.settings[this.currentTool].removesFullStrokes) {
                targets.forEach((obj:any) => obj.group?.removeWithUpdate(obj) || this.editor.canvas.remove(obj));
            }
        })
    }

    loadDraft(draft : Journal) {
        if (!this.editor) return;
        // something
    }

    saveDraft() {
        const journal : Journal = {
            content: {data: encodeURIComponent(this.editor.canvas.toSVG())},
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
            content: {data: encodeURIComponent(this.editor.canvas.toSVG())},
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
}