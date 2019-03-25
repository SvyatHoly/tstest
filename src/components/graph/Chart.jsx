import React, {Component} from 'react'
import {scaleBand, scaleLinear} from 'd3'
import objToArr from '../../util/objToArr'
import * as _ from 'lodash'

import data from '../../data/data'
import Axes from "./Axes";
import Bars from "./Bars";

export default class Chart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            maxValue: 0
        };

        this.xScale = scaleBand();
        this.yScale = scaleLinear();
    }

    componentDidMount() {
        const newData = [];
        const arrFromData = objToArr(data).flat(3);

        for (let i = 0; i < arrFromData.length; i += 8) {
            const newArr = arrFromData.slice(i, i + 8);
            newArr.splice(2, 1, _.parseInt(newArr[2]) + _.parseInt(newArr[6]));
            newArr.splice(3, 1, _.parseInt(newArr[3]) + _.parseInt(newArr[7]));
            newData.push(Object.assign({}, newArr));
            const maxValue = Math.max(...newData.map(d => {
                return d['2']
            }));
            console.log(newData)
            this.setState({data: newData, maxValue: maxValue})

        }
    }

    render() {
        const {data, maxValue} = this.state;
        const margins = {top: 50, right: 20, bottom: 100, left: 60};
        const svgDimensions = {width: 800, height: 500};



        // scaleBand type
        const xScale = this.xScale
            .padding(0.5)
            // scaleBand domain should be an array of specific values
            // in our case, we want to use movie titles
            .domain(data.map(d => d['0']))
            .range([margins.left, svgDimensions.width - margins.right]);

        // scaleLinear type
        const yScale = this.yScale
        // scaleLinear domain required at least two values, min and max
            .domain([0, maxValue])
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
                    data={data}
                    maxValue={maxValue}
                    svgDimensions={svgDimensions}
                />
            </svg>
        )
    }
}