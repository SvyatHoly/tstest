import React from 'react';
import TableBody from "./TableBody";
import TableHead from "./TableHead";

export default function table({data, sortBy, columns}) {
    return (
        <table className={'table'}>
            <thead>
            <tr>
                <TableHead columns={columns} sortBy={sortBy}/>
            </tr>
            </thead>
            <tbody>
            <TableBody data={data}/>
            </tbody>
        </table>
    );
}