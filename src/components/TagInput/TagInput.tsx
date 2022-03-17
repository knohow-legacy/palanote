import React from 'react';
import './TagInput.css';
import { Tag } from '@mui/icons-material';

function TagInput({tags, setTags, maxTags=5} : any) {

    function validKey(keyCode: number, shiftKey: boolean) {
        return (
        (keyCode >= 48 && keyCode <= 57 && !shiftKey) || // 0 - 9
        (keyCode >= 65 && keyCode <= 90) || // a - z
        (keyCode === 32) || // space
        (keyCode === 9) || // tab
        (keyCode === 8) || // backspace
        (keyCode === 51 && shiftKey) // #
        )
    }

    function onKeyDown(e:any) {
        if (e.keyCode === 16 || !e.keyCode) return;
        if (!validKey(e.keyCode, e.shiftKey)) return e.preventDefault();

        let value = e.target.value.replace(/\s+/g, ' ').trim();
        
        if (e.keyCode === 8 && value.length === 0 && tags.length > 0) {
            // backspace
            setTags(tags.slice(0, tags.length - 1));
            e.target.value = tags[tags.length - 1];
            e.target.placeholder = 'Add tags...';
        }
        if (e.keyCode === 32 || e.keyCode === 9 || e.keyCode === 13) { // #
            e.preventDefault();
            if (value.length > 0) {
                let tagToAdd = value.includes('#') ? value.split('#')[1] : value;
                if (!tags.includes(tagToAdd) && tags.length < maxTags) {
                    setTags([...tags, tagToAdd.toLowerCase()]);
                }
                e.target.value = '';
                if (tags.length >= maxTags - 1) {
                    e.target.placeholder = 'Max tags reached.';
                }
            }
        }
    }

    return (
        <div style={{position: 'relative', width: '50%', height: '100%'}}>
            <div className="input tagInput" onClick={(e:any) => {e.currentTarget.getElementsByTagName('input')[0].focus()}} onKeyDown={onKeyDown}>
                {tags.map((tag:string, i:number) => <span className="tag" key={i}><Tag />{tag}</span>)}
                <input
                    className="editable"
                    onChange={onKeyDown}
                    placeholder="Add tags..."
                    type="text"
                    maxLength={32}
                />
            </div>
        </div>
    );
}

export default TagInput;
