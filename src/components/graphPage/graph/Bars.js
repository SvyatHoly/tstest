import {useEffect, useState} from 'react';
import {interpolateLab, scaleLinear, select} from 'd3';
import * as PropTypes from 'prop-types';
import './Bars.scss';

bars.propTypes = {
    scales: PropTypes.object,
    margins: PropTypes.object,
    data: PropTypes.array,
    dimensions: PropTypes.object,
    forwardRef: PropTypes.object,
    maxVal: PropTypes.number
};

/**
 * Component render bars to the chart
 */
export default function bars({data, forwardRef, scales, margins, dimensions, maxVal}) {
    const {xScale, yScale} = scales;
    const {height} = dimensions;

    const [locData, setLocData] = useState(null);

    /**
     * When component did mount create an array of x,y and other data for each bar
     */
    useEffect(() => {
        calcBarsPosition();
    }, [null]);

    /**
     * When location data is ready - start render bars
     */
    useEffect(() => {
        if (locData) {
            renderBars();
        }
    }, [locData]);

    const calcBarsPosition = () => {
        const locationData = [];

        data.forEach(item => {
            const {planSum, actualSum, date} = item;
            const yPlan = yScale(planSum);
            const yActual = yScale(actualSum) - 10;
            const id = date.replace(/\.+/g, '');

            const heightCalc = () => {
                if (actualSum === 0) {
                    return height - margins.bottom - Math.abs(yScale(planSum));
                }
                return height - margins.bottom - Math.abs(yScale(actualSum));
            };
            const x = xScale(date);

            const fill = setColor(actualSum, planSum);

            const obj = {
                actualSum,
                planSum,
                date,
                id,
                fill,
                textX: x - 10,
                textY: Math.abs(yPlan - yActual) > 20 ? yActual : yActual - 20,
                rectX: x,
                rectY: yScale(actualSum === 0 ? planSum : actualSum),
                height: heightCalc(),
                width: xScale.bandwidth(),
            };

            locationData.push(obj);
        });

        setLocData(locationData);
    };

    const setColor = (actualSum, planSum) => {

        const setGreen = scaleLinear()
            .domain([0, maxVal])
            .range(['#F3E5F5', '#40a200'])
            .interpolate(interpolateLab);

        const setRed = scaleLinear()
            .domain([0, maxVal])
            .range(['#a20a19', '#f57863'])
            .interpolate(interpolateLab);

        if (actualSum === 0) {
            return '#808580';
        } else if (actualSum >= planSum) {
            return setGreen(actualSum);
        }
        return setRed(actualSum);
    };

    const attributes = [];

    const renderBars = () => {

        locData.forEach((item, i) => {
            const {id, rectX, rectY, textX, textY, height, width, fill, actualSum} = item;

            setTimeout(() => createBar(), i * 100);

            const createBar = () => {
                const svg = select(forwardRef.current);
                svg
                    .append('rect')
                    .attr('x', rectX)
                    .attr('y', height + rectY)
                    .attr('width', width)
                    .attr('height', 0)
                    .attr('fill', fill)
                    .attr('id', 'bar' + id)
                    .attr('class', 'bar')
                    .on('click', () => barClickHandler(id))
                    .transition()
                    .duration(1000)
                    .attr('y', rectY)
                    .attr('height', height)
                    .attr('fill', fill);

                const text = svg.append('text')
                    .text(actualSum === 0 ? null : actualSum)
                    .attr('x', textX)
                    .attr('y', textY)
                    .attr('fill', '#a4aba6')
                    .attr('opacity', 0);

                text.transition()
                    .delay(300)
                    .duration(1000)
                    .attr('opacity', 1);

            };
        });
    };

    /**
     * @param id идентификатор
     * @returns ничего не возвращает
     * */
    const barClickHandler = (id) => {
        const dataMy = data.filter(x => x.date.replace(/\.+/g, '') === id);

        const textData = JSON.stringify(dataMy);

        let el = select('#bar' + id);
        if (attributes.length === 0 || attributes[0].id !== id) {
            const node = {
                el,
                id,
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
            barTransition({...attributes.shift(), show: false}, textData);
        }
    };

    const barTransition = (item, textData) => {
        let svg = select(forwardRef.current);
        const {x, y, height, width, fill, el, show, id} = item;

        const text = svg.append('text');

        if (show) {
            textData.split(',').forEach(el => {

                text.append('tspan')
                    .text(el.replace(/[[\]}{"]+/g, ' '))
                    .attr('dy', '1em')
                    .attr('x', 2000)
                    .attr('class', 'text' + id);
            });
            text
                .attr("y", 150)
                .attr("x", 2000)
                .attr('id', 'text' + id);


            el.transition()
                .duration(800)
                .attr("y", 100)
                .attr("x", 900)
                .attr('width', 300)
                .attr('height', 300)
                .attr('fill', '#5f9cb1')
                .on("start", () => {
                    svg.selectAll('.text' + id)
                        .transition()
                        .duration(800)
                        .attr("x", 950);
                });
        } else {
            const tspan = svg.selectAll('tspan');

            tspan
                .transition()
                .duration(800)
                .attr("x", 2000)
                .on('end', () => {
                    select('#text' + id).remove();
                });
            el.transition()
                .duration(800)
                .attr("y", y)
                .attr("x", x)
                .attr('width', width)
                .attr('height', height)
                .attr('fill', fill);
        }
    };

    return null;
}