import React, {createRef, useEffect, useState} from 'react'
import * as d3 from 'd3'
import {interpolateLab, scaleLinear} from 'd3'
import './Bars.css'
import Aux from '../../../hoc/Aux/Aux'

const bars = (props) => {
    const {data, forwardRef, scales, margins, svgDimensions, json, maxVal} = props;

    const [sRef, setSRef] = useState(null);

    useEffect(() => {
        const refArr = data.map(el => ({ref: createRef(), id: el.date}));
        setSRef(refArr);
    }, [null]);

    const green = scaleLinear()
        .domain([0, maxVal])
        .range(['#F3E5F5', '#40a200'])
        .interpolate(interpolateLab);

    const red = scaleLinear()
        .domain([0, maxVal])
        .range(['#a20a19', '#f57863'])
        .interpolate(interpolateLab);


    const attributes = [];

    const barClickHandler = (id) => {
        const data = json.filter(x => x.date === id);

        const textData = JSON.stringify(data);
        const refById = sRef.find(x => x.id === id).ref;
        let el = d3.select(refById.current);
        if (attributes.length === 0 || attributes[0].id !== id) {
            const node = {
                el: el,
                id: id,
                x: el._groups[0][0].attributes[1].nodeValue,
                y: el._groups[0][0].attributes[2].nodeValue,
                height: el._groups[0][0].attributes[3].nodeValue,
                width: el._groups[0][0].attributes[4].nodeValue,
                fill: el._groups[0][0].attributes[5].nodeValue,
                show: true
            };
            attributes.push(node);
            barTransition(node, textData);
        } else {
            barTransition({...attributes.pop(), show: false}, textData);
        }

        while (attributes.length > 1) {
            barTransition({...attributes.shift(), show: false}, textData)
        }
    };

    const barTransition = (node, textData) => {
        let svg = d3.select(forwardRef.current);
        const {x, y, height, width, fill, el, show, id} = node;

        const text = svg.append('text');

        if (show) {
            textData.split(',').forEach(el => {

                text.append('tspan')
                    .text(el.replace(/[[\]}{"]+/g, ' '))
                    .attr('dy', '1em')
                    .attr('x', 2000)
                    .attr('class', 'text' + id.replace(/\.+/g, ''))
            });
            text
                .attr("y", 150)
                .attr("x", 2000)
                .attr('id', 'text' + id.replace(/\.+/g, ''));


            el.transition()
                .duration(800)
                .attr("y", 100)
                .attr("x", 900)
                .attr('width', 300)
                .attr('height', 300)
                .attr('fill', '#5f9cb1')
                .on("start", () => {
                    svg.selectAll('.text' + id.replace(/\.+/g, ''))
                        .transition()
                        .duration(800)
                        .attr("x", 950);
                })
        } else {
            const tspan = svg.selectAll('tspan');
            tspan
                .transition()
                .duration(800)
                .attr("x", 2000)
                .on('end', () => {
                    d3.select('#text' + id.replace(/\.+/g, '')).remove()
                });
            el.transition()
                .duration(800)
                .attr("y", y)
                .attr("x", x)
                .attr('width', width)
                .attr('height', height)
                .attr('fill', fill)
        }
    };

    const {xScale, yScale} = scales;
    const {height} = svgDimensions;

    let bars = null;

    if (sRef) {
        bars = data.map((datum, i) => {
            const yPlan = yScale(datum.planSum);
            const y = yScale(datum.actualSum) - 10;

            const fillColor = () => {
                if (datum.actualSum === 0) {
                    return '#808580'
                } else if (datum.actualSum >= datum.planSum) {
                    return green(datum.actualSum)
                } else {
                    return red(datum.actualSum)
                }
            };

            const heightCalc = () => {
                if (datum.actualSum === 0) {
                    return height - margins.bottom - Math.abs(yScale(datum.planSum))
                } else {
                    return height - margins.bottom - Math.abs(yScale(datum.actualSum))
                }
            };

            return (
                <Aux key={datum.date}>
                    <text
                        x={xScale(datum.date) - 10}
                        y={Math.abs(yPlan - y) > 20 ? y : y - 20}
                        fill={'#dedddd'}
                    >
                        {datum.actualSum === 0 ? null : datum.actualSum}
                    </text>
                    <rect
                        ref={sRef[i].ref}
                        className="bar"
                        x={xScale(datum.date)}
                        y={yScale(datum.actualSum === 0 ? datum.planSum : datum.actualSum)}
                        height={heightCalc()}
                        width={xScale.bandwidth()}
                        fill={fillColor()}
                        onClick={() => barClickHandler(datum.date)}
                    />
                </Aux>
            )
        })
    }

    return <g>{bars}</g>
};

export default bars;