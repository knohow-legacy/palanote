import React from 'react';
import EditorHandler from '../../EditorHandler/EditorHandler';
import { BorderColor, BorderColorOutlined, FormatBold, FormatItalic, FormatUnderlined } from '@mui/icons-material';
import { colors } from '../HandwritingTool/HandwritingToolOverlay'
import '../HandwritingTool/HandwritingToolOverlay.css';

// Overlay for the text tool (colors, bolding, font family, etc)

function TextToolOverlay({tool, editorHandler} : {tool : string, editorHandler : EditorHandler | undefined}) {
    const settings = editorHandler?.textSettings;

    const [colorState, setColorState] = React.useState(settings?.color);
    const [sizeState, setSizeState] = React.useState(settings?.fontSize);
    const [boldState, setBoldState] = React.useState(settings?.isBold);
    const [italicState, setItalicState] = React.useState(settings?.isItalic);
    const [underlineState, setUnderlineState] = React.useState(settings?.isUnderline);

    const updateColor = (color : string) => {
        setColorState(color);
        editorHandler?.updateTextSettings({color: color});
    }
    const updateSize = (size : string) => {
        let sizeNum = parseInt(size);
        setSizeState(sizeNum);
        editorHandler?.updateTextSettings({fontSize: sizeNum});
    }
    const updateBold = (bold : boolean) => {
        setBoldState(bold);
        editorHandler?.updateTextSettings({isBold: bold});
    }
    const updateItalic = (italic : boolean) => {
        setItalicState(italic);
        editorHandler?.updateTextSettings({isItalic: italic});
    }
    const updateUnderline = (underline : boolean) => {
        setUnderlineState(underline);
        editorHandler?.updateTextSettings({isUnderline: underline});
    }

    React.useEffect(() => {
        setColorState(editorHandler?.textSettings.color);
        setSizeState(editorHandler?.textSettings.fontSize);
        setBoldState(editorHandler?.textSettings.isBold);
        setItalicState(editorHandler?.textSettings.isItalic);
        setUnderlineState(editorHandler?.textSettings.isUnderline);
    }, [editorHandler?.textSettings]);

    let size = settings?.fontSize || 2;

    const stopPropagation = (e : any) => e.stopPropagation();
    return (
        <div className="toolOverlay" onClick={stopPropagation} onMouseOver={stopPropagation}>
            <div className="colorPicker">
                {colors.map((color : any) => (
                    <div key={color.name}
                    title={color.name}
                    className={colorState === color.color ? 'color selectedColor' : 'color'}
                    style={{backgroundColor: color.color}}
                    onClick={(e:any) => updateColor(color.color)} />
                ))}
            </div>
            <div className="widthPicker">
                <input className="widthInput" type="number" value={size} onChange={(e:any) => updateSize((e.target as HTMLInputElement).value)} min="1" max="20" />
                <input className="widthSlider" type="range" value={size} onChange={(e:any) => updateSize((e.target as HTMLInputElement).value)} min="1" max="20" />
            </div>
            <div className="formatPicker">
                <div onClick={(e:any) => updateBold(!boldState)} className={boldState ? "boldBtn selectedBtn" : "boldBtn"}><FormatBold /></div>
                <div onClick={(e:any) => updateItalic(!italicState)} className={italicState ? "italicBtn selectedBtn" : "italicBtn"}><FormatItalic /></div>
                <div onClick={(e:any) => updateUnderline(!underlineState)} className={underlineState ? "underlineBtn selectedBtn" : "underlineBtn"}><FormatUnderlined /></div>
            </div>
        </div>
    )
}

export default TextToolOverlay;
