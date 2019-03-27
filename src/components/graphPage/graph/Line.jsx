import React, {useEffect, useRef} from 'react'
import * as d3 from 'd3'
import Aux from '../../../hoc/Aux/Aux'

const line = (props) => {
    const {scales, margins, data, svgDimensions} = props;
    const {xScale, yScale} = scales;
    const {width} = svgDimensions;
    let ref = useRef();

    const line = d3
        .line()
        .x(d => xScale(d.date) + xScale.bandwidth() / 2)
        .y(d => yScale(d.plan))
        .curve(d3.curveMonotoneX);

    useEffect(() => {
        d3.select(ref.current)
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.date) + xScale.bandwidth() / 2)
            .attr('cy', d => yScale(d.plan))
            .attr('r', 8)
            .on('mouseover', d => appendChild(d))
            .on('mouseout', d => removeChild(d))

    }, [data]);

    const appendChild = (id) => {
        const info = d3.select(ref.current)
            .append('rect')
            .attr('x', xScale(id.date) + xScale.bandwidth() / 2 - 100)
            .attr('y', 0)
            .attr('width', 200)
            .attr('height', 100)
            .attr('border', '3px solid black')
            .attr('id', 'info' + id.date.replace(/\.+/g, ''))
            .attr('fill', 'transparent');

        const text = d3.select(ref.current)
            .append('text')
            .text('план:  ' + id.plan)
            .attr('id', 'text' + id.date.replace(/\.+/g, ''))
            .attr('y', 0)
            .attr('x', xScale(id.date) + xScale.bandwidth() / 2 - 50)
            .attr('fill', 'transparent');

        info.transition()
            .duration(300)
            .attr('y', yScale(id.plan) - 120)
            .attr('fill', '#5f9cb1');

        text.transition()
            .duration(300)
            .attr('y', yScale(id.plan) - 90)
            .attr('fill', 'white')
    };

    const removeChild = (id) => {
        d3.select('#info' + id.date.replace(/\.+/g, ''))
            .transition()
            .duration(300)
            .attr('y', 0)
            .attr('fill', 'transparent')
            .on('end', () => d3.select('#info' + id.date.replace(/\.+/g, '')).remove());

        d3.select('#text' + id.date.replace(/\.+/g, ''))
            .transition()
            .duration(300)
            .attr('y', 0)
            .attr('fill', 'transparent')
            .on('end', () => d3.select('#text' + id.date.replace(/\.+/g, '')).remove());
    };

    let end = 0;
    let start = 0;

    if (data[0]) {
        start = yScale(data[0].plan);
        end = yScale(data[data.length - 1].plan);
    }

    return (
        <Aux>
            <g
                fill={'none'}
                stroke={'#ffab00'}
                strokeWidth={3}
            >
                <path d={`M${margins.left} ${start} h ${margins.left}`}/>
                <path d={`M${width - margins.right} ${end} h ${-margins.left - 5}`}/>
                <path d={line(data)}/>
            </g>
            <g fill={'white'} ref={ref}/>
        </Aux>
    )
};

export default line;