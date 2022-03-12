import { FabricJSEditor } from 'fabricjs-react';
import { PSBrush } from "@arch-inc/fabricjs-psbrush";
import { fabric } from "fabric";

interface BrushSettings {
    width: number;
    color: string;
    opacity: number; // Determines the opacity
    pressureSensitive: boolean; // Determines if pressure sensitivity is enabled (iPad)
}
interface BrushSettingsOptions {
    width?: number;
    color?: string;
    opacity?: number; // Determines the opacity
    pressureSensitive?: boolean; // Determines if pressure sensitivity is enabled (iPad)
}
type Tool = 'select' | 'pen' | 'highlighter' | 'eraser' | 'text';
type BrushTool = 'pen' | 'highlighter' | 'eraser';

export default class EditorHandler {
    editor? : FabricJSEditor;

    currentTool : Tool = 'select';
    settings : {[key:string]:BrushSettings} = {
        pen: {
            width: 2,
            color: 'black',
            opacity: 1,
            pressureSensitive: true
        },
        highlighter: {
            width: 10,
            color: 'yellow',
            opacity: 0.5,
            pressureSensitive: false
        },
        eraser: {
            width: 10,
            color: 'white',
            opacity: 1,
            pressureSensitive: false
        }
    };

    constructor(editor : FabricJSEditor) {
        this.editor = editor;

        // set up base stuff with the canvas;

    }

    loadDraft(draft : any) {
        if (!this.editor) return;
        // something
    }

    updateToolSettings(tool: BrushTool | null, settings: BrushSettingsOptions) {
        if (!this.editor) return;
        if (!tool) tool = this.currentTool as BrushTool;
        
        if (!this.settings[tool]) return; // not a valid tool

        Object.assign(this.settings[tool], settings);
        console.log(this.settings[tool]);
        this.applyToolSettings(tool);
    }

    applyToolSettings(tool: BrushTool) {
        if (!this.editor) return;

        let brush = new PSBrush(this.editor.canvas);
        this.editor.canvas.freeDrawingBrush = brush;
        brush.pressureManager.fallback = this.settings[tool].width / 2;
        if (this.settings[tool].pressureSensitive) {
            brush.pressureManager.min = 0;
        } else {
            brush.pressureManager.min = 1;
        }
        this.editor.canvas.freeDrawingBrush.width = this.settings[tool].width;
        this.editor.canvas.freeDrawingBrush.color = this.settings[tool].color;
        (this.editor.canvas.freeDrawingBrush as any).opacity = this.settings[tool].opacity;
    }

    setTool(tool : Tool) {
        if (!this.editor) return;
        
        this.currentTool = tool;
        if (['pen', 'highlighter', 'eraser'].includes(tool)) {
            this.editor.canvas.isDrawingMode = true;
            this.applyToolSettings(tool as BrushTool);
        } else {
            this.editor.canvas.isDrawingMode = false;
        }
    }
}