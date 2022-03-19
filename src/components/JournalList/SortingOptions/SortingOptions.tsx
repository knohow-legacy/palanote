import React from 'react';
import { AutoMode, AllInclusive, AutoAwesome, ArrowDropDown, TrendingUp, NewReleases } from '@mui/icons-material';
import ContextMenu from '../../ContextMenu/ContextMenu';
import './SortingOptions.css';

function SortingOptions({sortMode, setSortMode, remixMode, setRemixMode} : {sortMode: string, setSortMode: any, remixMode: string, setRemixMode: any}) {
    const sortItems = [
        {
            label: 'Top',
            icon: <TrendingUp />,
            className: 'top',
            href: '',
            onClick: (e:any) => {setSortMode('top')}
        },
        {
            label: 'New',
            icon: <NewReleases />,
            className: 'new',
            href: '',
            onClick: (e:any) => {setSortMode('new')}
        }
    ]

    const sortRemixes = [
        {
            label: 'All',
            icon: <AllInclusive />,
            className: 'true',
            href: '',
            onClick: (e:any) => {setRemixMode('true')}
        },
        {
            label: 'Journals',
            icon: <AutoAwesome />,
            className: 'false',
            href: '',
            onClick: (e:any) => {setRemixMode('false')}
        },
        {
            label: 'Remixes',
            icon: <AutoMode />,
            className: 'only',
            href: '',
            onClick: (e:any) => {setRemixMode('only')}
        },
    ]

    const currentSorting = sortItems.find((elem:any) => elem.className === sortMode);
    const currentRemixes = sortRemixes.find((elem:any) => elem.className === remixMode);

    return (<div key="sortingOptions" className="sortingOptions">
        <ContextMenu title="Set sort mode" direction="down-right" items={sortItems}>
            <p>{currentSorting?.icon} {currentSorting?.label} <ArrowDropDown /></p>
        </ContextMenu>
        <ContextMenu title="Set sort mode" direction="down-right" items={sortRemixes}>
            <p>{currentRemixes?.icon} {currentRemixes?.label} <ArrowDropDown /></p>
        </ContextMenu>
    </div>)
}

export default SortingOptions;
