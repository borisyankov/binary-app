import React, { PropTypes } from 'react';

const TradingTimesRow = ({ asset, compact }) => {
    const eventStrs = asset.events.map(e => e.descrip + ': ' + e.dates);

    return (
        <tr>
            <td>{asset.name}</td>
            <td>{asset.times.open.map(openTime => <div key={openTime}>{openTime}</div>)}</td>
            <td>{asset.times.close.map(closeTime => <div key={closeTime}>{closeTime}</div>)}</td>
            <td>{asset.times.settlement}</td>
            {!compact && <td>{eventStrs.map((event, i) => <div key={i}>{event}</div>)}</td>}
        </tr>
    );
};

TradingTimesRow.propTypes = {
    asset: PropTypes.object.isRequired,
};

export default TradingTimesRow;
