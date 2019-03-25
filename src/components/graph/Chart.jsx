import React, {Component} from 'react'
import {scaleBand, scaleLinear} from 'd3'
import * as _ from 'lodash'

import json from '../../data/data'
import Axes from "./Axes";
import Bars from "./Bars";
import Line from "./Line";

const data = json;

export default class Chart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataJson: data,
            dataNormal: [],
            maxValue: 0
        };

        this.xScale = scaleBand();
        this.yScale = scaleLinear();
    }

    componentDidMount() {
        const {dataJson, maxValue} = this.state;
        const {data} = dataJson;
        const newData = [];
        let maxValCalc = 0;

        data.reduce((prev, curr, i) => {
            const actual = _.parseInt(curr.leftovers.actual.replace(/ /g, ''));
            const plan = _.parseInt(curr.leftovers.plan.replace(/ /g, ''));
            const date = curr.date;



            if (i % 2 !== 0) {
                const actualSum = prev.actual + actual;
                if (actualSum > maxValCalc) maxValCalc = actualSum;
                const planSum = prev.plan + plan;
                newData.push({date: date, actual: actualSum, plan: planSum});
                return null;
            } else {
                return {actual: actual, plan: plan}
            }
        }, 0);

        this.setState({dataNormal: newData, maxValue: maxValCalc});

    }

    render() {
        const {dataNormal, maxValue} = this.state;
        const margins = {top: 50, right: 20, bottom: 100, left: 60};
        const svgDimensions = {width: 800, height: 500};


        // scaleBand type
        const xScale = this.xScale
            .padding(0.5)
            // scaleBand domain should be an array of specific values
            // in our case, we want to use movie titles
            .domain(dataNormal.map(d => d.date))
            .range([margins.left, svgDimensions.width - margins.right]);

        // scaleLinear type
        const yScale = this.yScale
        // scaleLinear domain required at least two values, min and max
            .domain([0, maxValue+maxValue/5])
            .range([svgDimensions.height - margins.bottom, margins.top]);

        return (
            <svg width={svgDimensions.width} height={svgDimensions.height}>
                <Axes
                scales={{xScale, yScale}}
                margins={margins}
                svgDimensions={svgDimensions}
            />
                <Bars
                    scales={{xScale, yScale}}
                    margins={margins}
                    data={dataNormal}
                    maxValue={maxValue}
                    svgDimensions={svgDimensions}
                />
                <Line
                    scales={{xScale, yScale}}
                    margins={margins}
                    data={dataNormal}
                    maxValue={maxValue}
                    svgDimensions={svgDimensions}
                />
            </svg>
        )
    }
}