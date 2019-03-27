import React, {useEffect, useState} from 'react';
import Chart from './graph/Chart';
import jsonFromServer from '../../data/data';
import * as _ from "lodash";
import pathChecker from '../../util/pathChecker';

const graphPage = () => {

    const [data, setData] = useState(jsonFromServer.data);
    const [normalData, setNormalData] = useState(null);
    const [maxVal, setMaxVal] = useState(0);

    useEffect(() => {
        const newData = [];
        let maxValCalc = 0;

        data.reduce((prev, curr, i) => {
            const actualChecked = pathChecker(['leftovers', 'actual'], curr);
            const planChecked = pathChecker(['leftovers', 'plan'], curr);
            const sectorChecked = pathChecker(['sector'], curr);
            const date = pathChecker(['date'], curr);

            const actual = _.parseInt(actualChecked.replace(/ /g, ''));
            const plan = _.parseInt(planChecked.replace(/ /g, ''));


            if (i % 2 !== 0) {
                const actualSum = prev.actual + actual;
                const planSum = prev.plan + plan;
                const curNode = {actual: actual, plan: plan, sector: sectorChecked};
                const divided = [curNode, prev];

                if (actualSum > maxValCalc) {
                    maxValCalc = actualSum;
                }

                newData.push({date: date, actualSum: actualSum, planSum: planSum, divided: divided});

                return null;

            } else {
                return {actual: actual, plan: plan, sector: sectorChecked}
            }
        }, 0);

        setNormalData(newData);
        setMaxVal(maxValCalc);

    }, [null]);

    let chart = null;

    if (normalData) {
        chart = <Chart data={normalData} maxVal={maxVal} json={jsonFromServer.data}/>
    }

    return chart
};


export default graphPage;