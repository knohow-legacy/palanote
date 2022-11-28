import { useState } from 'react';
import { API } from '../../../API/API';
import './StarRating.css';

function Star({fill, activeFill, onClick, onHover, onHoverOff} : {fill: number, activeFill: number|null, onClick: any, onHover?: any, onHoverOff?: any}) {
    return <div className="star" onClick={onClick} onMouseEnter={onHover} onMouseLeave={onHoverOff}>
        <div className="starMask" style={{overflow: 'hidden'}}>
            <div className="fill" style={{
                width: `${Math.round((activeFill || fill) * 100)}%`,
                backgroundColor: activeFill ? 'var(--secondary)' : 'var(--primary-900)'
            }} />
        </div>
    </div>
}

function StarRating({journalId, rating, userRating} : {journalId: string, rating: number, userRating: number}) {
    const [cachedUserRating, setCachedUserRating] = useState(userRating);
    const [cachedRating, setCachedRating] = useState(rating);

    const onRate = async (rating: number) => {
        let {newAverageRating, newUserRating} = await API.rateJournal(journalId, rating);
        setCachedRating(newAverageRating);
        setCachedUserRating(newUserRating);
    }

    let fillPercent = cachedRating % 1;
    let activeFillPercent = userRating % 1;

    return (<div className="starRating" onClick={(e) => e.stopPropagation()} onMouseLeave={() => setCachedUserRating(-1)}>
        <Star
            fill={cachedRating >= 1 ? 1 : cachedRating < 0 ? 0 : fillPercent}
            activeFill={cachedUserRating >= 1 ? 1 : cachedUserRating < 0 ? 0 : activeFillPercent}
            onClick={onRate.bind(null, 1)}
            onHover={() => setCachedUserRating(1)} />
        <Star
            fill={cachedRating >= 2 ? 1 : cachedRating < 1 ? 0 : fillPercent}
            activeFill={cachedUserRating >= 2 ? 1 : cachedUserRating < 1 ? 0 : activeFillPercent}
            onClick={onRate.bind(null, 2)}
            onHover={() => setCachedUserRating(2)} />
        <Star
            fill={cachedRating >= 3 ? 1 : cachedRating < 2 ? 0 : fillPercent}
            activeFill={cachedUserRating >= 3 ? 1 : cachedUserRating < 2 ? 0 : activeFillPercent}
            onClick={onRate.bind(null, 3)}
            onHover={() => setCachedUserRating(3)} />
        <Star
            fill={cachedRating >= 4 ? 1 : cachedRating < 3 ? 0 : fillPercent}
            activeFill={cachedUserRating >= 4 ? 1 : cachedUserRating < 3 ? 0 : activeFillPercent}
            onClick={onRate.bind(null, 4)}
            onHover={() => setCachedUserRating(4)} />
        <Star
            fill={cachedRating >= 5 ? 1 : cachedRating < 4 ? 0 : fillPercent}
            activeFill={cachedUserRating >= 5 ? 1 : cachedUserRating < 4 ? 0 : activeFillPercent}
            onClick={onRate.bind(null, 5)}
            onHover={() => setCachedUserRating(5)} />
        
        <span>{cachedRating.toFixed(1)}</span>
    </div>)
}

export default StarRating;