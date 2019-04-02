import React from 'react';

export default function tableHead({columns, sortBy}) {
    return columns.map((header, i) => {
        return (
            <th key={i} className={'text'}>
                <button onClick={() => sortBy(i)}>
                    {header}
                </button>
            </th>
        );
    });
}