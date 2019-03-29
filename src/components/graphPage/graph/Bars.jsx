import React, {createRef, useEffect, useRef, useState} from 'react'
import * as d3 from 'd3'
import {interpolateLab, scaleLinear} from 'd3'
import './Bars.css'

const bars = (props) => {
    const {data, forwardRef, scales, margins, svgDimensions, json, maxVal} = props;
    const {xScale, yScale} = scales;
    const {height} = svgDimensions;

    const [sRef, setSRef] = useState(null);
    const [locData, setLocData] = useState(null);

    useEffect(() => {
        const refArr = data.map(el => ({ref: createRef(), id: el.date}));
        setSRef(refArr);
    }, [null]);

    useEffect(() => {
        if (sRef) {
            calcBarsPosition()

        }
    }, [sRef]);

    useEffect(() => {
        if (locData) {
            createAnimation()
        }
    }, [locData]);

    const calcBarsPosition = () => {
        const locationData = [];
        data.forEach((datum, i) => {
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
            const x = xScale(datum.date);

            const obj = {
                actualSum: datum.actualSum,
                date: datum.date,
                textX: x - 10,
                textY: Math.abs(yPlan - y) > 20 ? y : y - 20,
                ref: sRef[i].ref,
                rectX: x,
                rectY: yScale(datum.actualSum === 0 ? datum.planSum : datum.actualSum),
                height: heightCalc(),
                width: xScale.bandwidth(),
                fill: fillColor(),
                onClick: () => barClickHandler(datum.date)
            };

            locationData.push(obj);
        });

        setLocData(locationData);
    };

    const attributes = [];

    const createAnimation = () => {

        locData.forEach((el, i) => {

            setTimeout(() => createBar(), i * 100);

            const createBar = () => {
                d3.select(forwardRef.current)
                    .append('rect')
                    .attr('ref', el.ref.current)
                    .attr('x', el.rectX)
                    .attr('y', el.height + el.rectY)
                    .attr('width', el.width)
                    .attr('height', 0)
                    .attr('fill', el.fill)
                    .attr('id', 'bar' + el.date.replace(/\.+/g, ''))
                    .attr('class', 'bar')
                    .on('click', () => barClickHandler(el.date))
                    .transition()
                    .duration(1000)
                    .attr('y', el.rectY)
                    .attr('height', el.height)
                    .attr('fill', el.fill)
            }
        })
    };

    const green = scaleLinear()
        .domain([0, maxVal])
        .range(['#F3E5F5', '#40a200'])
        .interpolate(interpolateLab);

    const red = scaleLinear()
        .domain([0, maxVal])
        .range(['#a20a19', '#f57863'])
        .interpolate(interpolateLab);

    const barClickHandler = (id) => {
        const dataMy = data.filter(x => x.date === id);

        const textData = JSON.stringify(dataMy);

        let el = d3.select('#bar' + id.replace(/\.+/g, ''));
        if (attributes.length === 0 || attributes[0].id !== id) {
            const node = {
                el: el,
                id: id,
                x: el.attr('x'),
                y: el.attr('y'),
                height: el.attr('height'),
                width: el.attr('width'),
                fill: el.attr('fill'),
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
    
    return null;
};

export default bars;