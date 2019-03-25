import React, {Component} from 'react'
import {interpolateLab, scaleLinear} from 'd3'
import './Bars.css'
import Aux from '../../hoc/Aux/Aux'

export default class Bars extends Component {
    constructor(props) {
        super(props);

        this.green = scaleLinear()
            .domain([0, this.props.maxValue])
            .range(['#F3E5F5', '#40a200'])
            .interpolate(interpolateLab)

        this.red = scaleLinear()
            .domain([0, this.props.maxValue])
            .range(['#F3E5F5', '#a20a19'])
            .interpolate(interpolateLab)
    }

    render() {
        const {scales, margins, data, svgDimensions} = this.props;
        const {xScale, yScale} = scales;
        const {height} = svgDimensions;

        const bars = (
            data.map(datum => {
                const yPlan = yScale(datum.plan);
                const y = yScale(datum.actual)-10;
                console.log(yPlan+' - plan : actual  - '+yScale(datum.actual));
                return (
                    <Aux>
                    <text
                    x={xScale(datum.date)-10}
                    y={Math.abs(yPlan-y) > 20 ? y : y-20}
                    fill={'#a4aba6'}
                    >
                        {datum.actual}
                    </text>
                    <rect
                        className="bar"
                        key={datum.date}
                        x={xScale(datum.date)}
                        y={yScale(datum.actual)}
                        height={(height - margins.bottom - Math.abs(yScale(datum.actual)))}
                        width={xScale.bandwidth()}
                        fill={datum.actual >= datum.plan ?
                                this.green(datum.actual) : this.red(datum.actual)}
                        onClick={() => console.log('hey')}
                    />
                    </Aux>
                )
            })
        );

        return (
            <g>{bars}</g>
        )
    }
}