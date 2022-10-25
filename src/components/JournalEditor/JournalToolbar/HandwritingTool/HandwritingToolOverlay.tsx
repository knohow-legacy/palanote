import React from 'react';
import EditorHandler from '../../EditorHandler/EditorHandler';
import { BorderColor, BorderColorOutlined, Gesture } from '@mui/icons-material';
import './HandwritingToolOverlay.css';

// Overlay for handwritten tool (color, thickness, opacity)

export const colors = [
    {
        name: 'Black',
        color: '#000000',
    },
    {
        name: 'Brown',
        color: '#795548',
    },
    {
        name: 'Red',
        color: '#f44336',
    },
    {
        name: 'Orange',
        color: '#ff9800',
    },
    {
        name: 'Yellow',
        color: '#ffeb3b'
    },
    {
        name: 'Green',
        color: '#4caf50'
    },
    {
        name: 'Blue',
        color: '#2196f3',
    },
    {
        name: 'Purple',
        color: '#9c27b0',
    },
    {
        name: 'Pink',
        color: '#e91e63',
    },
    {
        name: 'White',
        color: '#ffffff',
    }
]

function HandwritingToolOverlay({tool, editorHandler, closeWindow, isOpen} : {tool : string, editorHandler : EditorHandler | undefined, closeWindow: any, isOpen: boolean}) {
    const settings = editorHandler?.settings[tool];

    const [colorState, setColorState] = React.useState(settings?.color);
    const [widthState, setWidthState] = React.useState(settings?.width);
    const [eraserState, setEraserState] = React.useState(settings?.removesFullStrokes);
    const [pressureState, setPressureState] = React.useState(settings?.pressureSensitive);
    const [opacityState, setOpacityState] = React.useState(settings?.opacity);

    const updateColor = (color : string) => {
        setColorState(color);
        editorHandler?.updateToolSettings(tool as any, {color: color});
    }
    const updateWidth = (width : string) => {
        let widthNum = parseInt(width);
        setWidthState(widthNum);
        editorHandler?.updateToolSettings(tool as any, {width: widthNum});
    }
    const updateEraser = (removesFullStrokes : boolean) => {
        setEraserState(removesFullStrokes);
        editorHandler?.updateToolSettings(tool as any, {removesFullStrokes});
    }

    const updatePressure = (pressureSensitive : boolean) => {
        setPressureState(pressureSensitive);
        editorHandler?.updateToolSettings(tool as any, {pressureSensitive});
    }

    let width = settings?.width || 2;

    const stopPropagation = (e : any) => e.stopPropagation();
    return (
        <div className={isOpen ? "toolOverlay" : "toolOverlay closed"} onClick={stopPropagation} onMouseOver={stopPropagation}>
            <div className="colorPicker">
                {tool !== 'eraser' && colors.map((color : any) => (
                    <div key={color.name}
                    title={color.name}
                    className={colorState === color.color ? 'color selectedColor' : 'color'}
                    style={{borderColor: color.color, backgroundColor: color.color}}
                    onClick={(e:any) => { updateColor(color.color); closeWindow() }} />
                ))}
            </div>
            
            {tool !== 'eraser' && (
                <>
                    <span style={{color: 'black'}}>Pressure Sensitivity</span>
                    <div className="eraserPicker">
                        <div key="Not Pressure Sensitive"
                        title="Not Pressure Sensitive"
                        className={pressureState ? 'eraser selectedEraser' : 'eraser'}
                        onClick={(e:any) => updatePressure(true)}>
                            <span>On</span>
                        </div>
                        <div key="Pressure Sensitive"
                        title="Pressure Sensitive"
                        className={pressureState ? 'eraser' : 'eraser selectedEraser'}
                        onClick={(e:any) => updatePressure(false)}>
                            <span>Off</span>
                        </div>
                    </div>
                </>
            )}
            {tool === 'eraser' && (
                <div className="eraserPicker">
                    <div key="Erase Full Strokes"
                    title="Erase Full Strokes"
                    className={eraserState ? 'eraser selectedEraser' : 'eraser'}
                    onClick={(e:any) => updateEraser(true)}>
                        <BorderColor />
                        <span>Full</span>
                    </div>
                    <div key="Erase Partial Strokes"
                    title="Erase Partial Strokes"
                    className={eraserState ? 'eraser' : 'eraser selectedEraser'}
                    onClick={(e:any) => updateEraser(false)}>
                        <BorderColorOutlined />
                        <span>Partial</span>
                    </div>
                </div>
            )}
            <div className="widthPicker">
                <input className="widthInput" type="number" value={width} onChange={(e:any) => updateWidth((e.target as HTMLInputElement).value)} min="1" max="20" />
                <input className="widthSlider" type="range" value={width} onChange={(e:any) => updateWidth((e.target as HTMLInputElement).value)} min="1" max="20" />
            </div>
        </div>
    )
}

export default HandwritingToolOverlay;
