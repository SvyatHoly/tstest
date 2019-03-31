import React, {useEffect, useState} from 'react';
import Chart from './graph/Chart';
import jsonFromServer from '../../data/data';
import _ from "lodash";
import pathChecker from '../../util/pathChecker';

/**
 * Context allow components to check whether they need to start render itself
 * */
export const GraphContext = React.createContext({
    isRenderStarted: false,
    startRenderGraphComponents: () => {}
});


/**
 * This component convert data to more usable format,
 * reducing two nodes with same 'date' to one node with sum of 'actual and 'plan',
 * and send 'normalData' to Chart.
 * */
const graphPage = () => {

    const {data} = jsonFromServer;

    const [normalData, setNormalData] = useState(null);
    const [maxVal, setMaxVal] = useState(0);
    const [isRenderStarted, setIsRenderStarted] = useState(false);

    useEffect(() => {
        normalizeData();
    }, [null]);

    const normalizeData = () => {
        const newData = [];
        let maxValCalc = 0;

        data.reduce((prev, curr, i) => {
            //check path to undefined values
            const actualChecked = pathChecker(['leftovers', 'actual'], curr);
            const planChecked = pathChecker(['leftovers', 'plan'], curr);
            const sector = pathChecker(['sector'], curr);
            const date = pathChecker(['date'], curr);

            //convert string value to number
            const actual = _.parseInt(actualChecked.replace(/ /g, ''));
            const plan = _.parseInt(planChecked.replace(/ /g, ''));

            // if index is even - sum values and push object to 'newData' array
            if (i % 2 !== 0) {
                const actualSum = prev.actual + actual;
                const planSum = prev.plan + plan;

                const curNode = {actual, plan, sector};

                const divided = [curNode, prev];

                // take max value
                if (actualSum > maxValCalc) {
                    maxValCalc = actualSum;
                }

                newData.push({date, actualSum, planSum, divided});

                return null;

            //else take value to next iteration
            } else {
                return {actual, plan, sector}
            }
        }, 0);

        setNormalData(newData);
        setMaxVal(maxValCalc);
    };

    /**
     * handle user click on 'show' button */
    const onStartClickHandler = () => {
        setIsRenderStarted(true)
    };
    /** Whether data is normalised send it to chart component */
    const renderChart = () => {
        if (normalData) {
            return (
                <Chart
                    data={normalData}
                    maxVal={maxVal}
                    onStart={onStartClickHandler}
                />
            )
        } else return null;
    };

    return (
        <GraphContext.Provider value={{
            isRenderStarted: isRenderStarted,
            startRenderGraphComponents: onStartClickHandler
        }}>

            {renderChart()}

        </GraphContext.Provider>
    )

};

export default graphPage;