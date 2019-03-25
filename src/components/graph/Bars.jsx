import React, { Component } from 'react'
import { scaleLinear } from 'd3'
import { interpolateLab } from 'd3'
import * as _ from 'lodash'
import './Bars.css'

export default class Bars extends Component {
    constructor(props) {
        super(props);

        this.colorScale = scaleLinear()
            .domain([0, this.props.maxValue])
            .range(['#F3E5F5', '#7B1FA2'])
            .interpolate(interpolateLab)
    }

    render() {
        const { scales, margins, data, svgDimensions } = this.props;
        const { xScale, yScale } = scales;
        const { height } = svgDimensions;

        // data.data.map(el => console.log(_.round(el.leftovers.actual, 0)));

        const bars = (
            data.map(datum => {
                return(
                <rect
                    onMouseEnter={()=>console.log('dd')}
                    className="bar"
                    key={datum['0']}
                    x={xScale(datum['0'])}
                    y={yScale(datum['2'])}
                    height={_.round(height - margins.bottom - scales.yScale(_.parseInt(datum['2'])))}
                    width={xScale.bandwidth()}
                    fill={this.colorScale(datum['2'])}
                    onClick={()=>console.log('hey')}
                />
                )})
        );

        return (
            <g>{bars}</g>
        )
    }
}