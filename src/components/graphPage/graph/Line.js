import {useEffect, useState} from 'react';
import * as d3 from 'd3';
import './Line.scss';
import * as PropTypes from 'prop-types';

line.propTypes = {
    scales: PropTypes.object,
    margins: PropTypes.object,
    data: PropTypes.array,
    dimensions: PropTypes.object,
    forwardRef: PropTypes.object
};

export default function line ({scales, margins, data, dimensions, forwardRef}) {
    const {xScale, yScale} = scales;
    const {width} = dimensions;

    const [lineData, setLinePath] = useState(null);
    const [curDate, setCurDate] = useState(null);

    useEffect(() => {
        prepareData();
    }, [null]);

    useEffect(() => {
        if (lineData) {
            renderLine();
            renderDots();
        }
    }, [lineData]);

    const createPath = d3
        .line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveMonotoneX);

    const renderLine = () => {

        const p = d3.select(forwardRef.current)
            .append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", createPath(lineData));

        const path = p.node();
        const totalLen = path.getTotalLength();

        let d = xScale(curDate);

        let sd = d,
            dp = d,
            count = 0;
        while (dp < totalLen) {
            dp += 2;
            sd += ", 2";
            count++;
        }

        if (count % 2 === 0) {
            sd += ", 2";
            sd += ", " + (totalLen - d);

            p
                .attr("stroke-dasharray", sd + " " + totalLen)
                .attr("stroke-dashoffset", totalLen + 200)
                .transition()
                .duration(2500)
                .attr("stroke-dashoffset", 0);
        }
    };

    const renderDots = () => {

        data.forEach((el, i) => {
            setTimeout(() => renderOneDot(el), i * 150);
        });

        const renderOneDot = (el) => {

            d3.select(forwardRef.current)
                .append('circle')
                .attr('cx', xScale(el.date) + xScale.bandwidth() / 2)
                .attr('cy', yScale(el.planSum))
                .attr('r', 8)
                .attr('fill', 'white')
                .attr('opacity', 0)
                .on('mouseover', () => appendChild(el))
                .on('mouseout', () => removeChild(el))
                .transition()
                .duration(1000)
                .attr('opacity', 1);
        };
    };

    const prepareData = () => {
        let isCurDateSetted = false;

        const prepared = data.map((el, i) => {

            if (el.actualSum === 0 && !isCurDateSetted) {
                isCurDateSetted = true;
                setCurDate(data[i - 1].date);
            }

            if (i === 0) {
                return {
                    x: margins.left,
                    y: yScale(el.planSum)
                };
            } else if (i !== data.length - 1) {
                return {
                    x: xScale(el.date) + xScale.bandwidth() / 2,
                    y: yScale(el.planSum)
                };
            } return {
                    x: width - margins.right,
                    y: yScale(el.planSum)
                };
        });

        setLinePath(prepared);
    };

    const appendChild = (id) => {

        const x = xScale(id.date);
        const y = yScale(id.planSum);
        const info = d3.select(forwardRef.current).append('rect');
        const text = d3.select(forwardRef.current).append('text');

        info
            .attr('x', x + xScale.bandwidth() / 2 - 100)
            .attr('y', 0)
            .attr('width', 200)
            .attr('height', 100)
            .attr('border', '3px solid black')
            .attr('id', 'info' + id.date.replace(/\.+/g, ''))
            .attr('fill', 'transparent');

        text
            .text('дата:  ' + id.date)
            .attr('id', 'text' + id.date.replace(/\.+/g, ''))
            .attr('y', 0)
            .attr('x', x + xScale.bandwidth() / 2 - 50)
            .attr('fill', 'white');

        text.append('tspan')
            .text(id.planSum)
            .attr('x', function () {
                return d3.select(this.parentNode).attr("x");
            })
            .attr('y', function () {
                return d3.select(this.parentNode).attr("y");
            })
            .attr('fill', 'white');


        info.transition()
            .duration(300)
            .attr('y', y - 120)
            .attr('fill', '#5f9cb1');

        text.transition()
            .duration(300)
            .attr('y', y - 90)
            .attr('fill', 'white')
            .on('end', function () {
                text.append('tspan')
                    .text('план:  ' + id.planSum)
                    .attr('id', 'tspan' + id.date.replace(/\.+/g, ''))
                    .attr('x', x + xScale.bandwidth() / 2 - 50)
                    .attr('y', 0)
                    .attr('fill', 'transparent')
                    .transition()
                    .duration(200)
                    .attr('y', y - 60)
                    .attr('fill', 'white');
            });
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


        d3.select('#tspan' + id.date.replace(/\.+/g, ''))
            .transition()
            .duration(300)
            .attr('y', 0)
            .attr('fill', 'transparent')
            .on('end', () => d3.select('#tspan' + id.date.replace(/\.+/g, '')).remove());
    };

    return null;
}