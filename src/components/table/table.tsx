import React, {useEffect, useState} from 'react';
import SberData from '../../data/table.json'
import pathChecker from '../../util/pathChecker';
import Table from "./table/Table";
import './table.scss'
import ColorChart from "./table/ColorBar";

const data = SberData;

export default function table() {
    const [normalData, setNormalData] = useState(null);
    const [columns, setColumns] = useState(null);
    const [sortDirection, setSortDirection] = useState(1);

    useEffect(() => {
        normalizeData();
    }, [null]);

    const sortBy = (column: any) => {
        function sortByKey(array: any, key: any) {
            return array.sort(function (a: any, b: any) {
                const x = a[key];
                const y = b[key];
                if (sortDirection === 0) {
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                } else {
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                }
            });
        }

        const sortData = sortByKey(normalData, column);
        const direction = sortDirection === 1 ? 0 : 1;

        setNormalData(sortData);
        setSortDirection(direction);
    };

    const normalizeData = () => {

        const columnNames = pathChecker(['fa', 'fa_data', 'axis', 'r'], data);
        const dataArray = pathChecker(['fa', 'fa_data', 'r'], data);

        interface dataNode {
            fDeltaPlan: number;
            axis: Array<Object>;
            sMeasDelta_RU: string;
        }

        const fullColumnNames = [
            ...columnNames.map((el: { sAxisName: string }) => el.sAxisName.toUpperCase()),
            'ВАЛЮТА',
            'ОТКЛОНЕНИЕ ОТ ПЛАНА, П.П.'
        ];

        const maxVal = dataArray.reduce((acc: any, cur: dataNode, i: number) => {
            if (i === 0) {
                return cur.fDeltaPlan
            } else return Math.max(acc, cur.fDeltaPlan);
        }, 0);

        const normalData = dataArray.map((el: dataNode) => {
            const namesArr = pathChecker(['axis', 'r'], el);
            const meas = pathChecker(['sMeasDelta_RU'], el);
            const plan = pathChecker(['fDeltaPlan'], el);
            const percentage = Math.round(plan * 100 / maxVal);
            return [
                ...namesArr.map((name: string) => pathChecker(['sName_RU'], name)),
                meas,
                percentage
            ]
        });

        setColumns(fullColumnNames);
        setNormalData(normalData);
    };

    if (normalData) {
        return (
            <div className={'table-container'}>
                <Table columns={columns} data={normalData} sortBy={sortBy}/>
            </div>
        )
    } else return null;
}