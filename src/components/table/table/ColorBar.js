import React from 'react';

export default function colorBar({percantage}) {
    const isPositive = percantage > 0;
    const drawStyle = {
        width: Math.abs(percantage) + '%',
        backgroundImage: isPositive ? 'linear-gradient(to left, #d84852 , #f2505c)' : 'linear-gradient(to right, #329c60 , #4cc881)'
    };
    const barStyle = {
        justifyContent: isPositive ? 'flex-end' : 'flex-start',
    };
    const bar = (
        <div style={barStyle} className="tablebar">
            <div style={drawStyle}></div>
        </div>
    );
    let value = isPositive ? '+'+percantage : percantage;
    if (percantage === 0) {value = "    "+percantage;}
    return (
        <div className="indicator">
            <div className="tablebar-container">{ percantage > 0 ? bar : '' }</div>
            <div>{ value + ' п.п.'}</div>
            <div className="tablebar-container">{ percantage < 0 ? bar : '' }</div>
        </div>
    );
}