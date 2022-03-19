import React from 'react';
import { useInfiniteQuery } from 'react-query';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

import { PublishedJournal } from '../API/API';
import Journal from '../Journal/Journal';
import Loading from '../Loading/Loading';
import Error from '../Error/Error';
import './JournalList.css';
import SortingOptions from './SortingOptions/SortingOptions';

/**
 * Infinite query for fetching journals.
 * @param function fetchRoute - Function to fetch data, ideally bounded to the API class. Must have:
 *  - params[0 - x]: parameters in fetchArgs.
 *  - params[x + 1]: offset.
 *  - params[x + 2]: limit.
 * @param array fetchArgs - Arguments to pass to fetchRoute (see above).
 */

const limit = 10;

function JournalList({fetchRoute, fetchArgs, showActions=true} : {fetchRoute : Function, fetchArgs : Array<any>, showActions?: boolean}) {
    const [sortMode, setSortMode] = React.useState<'new' | 'top'>('new');
    const [remixMode, setRemixMode] = React.useState<'true' | 'false' | 'only'>('true');

    const {data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status} : any = useInfiniteQuery([`journals-${fetchArgs}`, sortMode, remixMode],
            async ({pageParam=0}) => {return await fetchRoute(...fetchArgs, sortMode, remixMode, pageParam, limit)},
            { getNextPageParam: (lastPage, pages) => (lastPage.length === 0 ? null : pages.length) }
        );
    
    const bottomRef = React.useRef(null);

    useIntersectionObserver({
        target: bottomRef,
        onIntersect: fetchNextPage,
        enabled: !!hasNextPage,
    })

    switch(status) {
        case 'loading':
            return <div className="journalList"><Loading /></div>;
        case 'error':
            return <div className="journalList"><Error text={error.message} /></div>;
        default:
            return <div className="journalList">
                {showActions && <SortingOptions setSortMode={setSortMode} sortMode={sortMode} setRemixMode={setRemixMode} remixMode={remixMode} />}
                {data.pages.map((page: Array<PublishedJournal>, pageIndex:number) =>
                    (
                    <React.Fragment key={pageIndex * -1}>
                        {page.map((journal, index) => <Journal key={index + limit * pageIndex} index={index + limit * pageIndex} journal={journal} expanded={false} />)}
                    </React.Fragment>
                ))}

                <div key="bottom" ref={bottomRef} className="bottom">
                    {isFetchingNextPage && <Loading />}
                    {hasNextPage && !isFetchingNextPage && <button onClick={fetchNextPage}>Load more</button>}
                    {!isFetchingNextPage && !hasNextPage && <div key="noMore" className="noMore">No more...</div>}
                </div>
            </div>
    }
}

export default JournalList;
