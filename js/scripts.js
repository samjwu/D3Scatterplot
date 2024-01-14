document.addEventListener('DOMContentLoaded', function () {
    var xYear = d3.scaleLinear().range([0, graphWidth]);

    var yTime = d3.scaleTime().range([0, graphHeight]);

    var color = d3.scaleOrdinal(d3.schemeSet1);

    var xAxis = d3.axisBottom(xYear).tickFormat(d3.format('d'));

    var yAxis = d3.axisLeft(yTime).tickFormat(d3.format('d'));

    var tooltipDiv = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .attr('id', 'tooltip')
        .style('opacity', 0);

    var svg = d3
        .select('body')
        .append('svg')
        .attr('width', graphWidth + graphMargin.left + graphMargin.right)
        .attr('height', graphHeight + graphMargin.top + graphMargin.bottom)
        .attr('class', 'graph')
        .append('g')
        .attr('transform', 'translate(' + graphMargin.left + ',' + graphMargin.top + ')');

    d3.json(dataSource)
        .then((data) => {
            xYear.domain([
                d3.min(data, function (d) {
                    return d.Year - 1;
                }),
                d3.max(data, function (d) {
                    return d.Year + 1;
                })
            ]);

            yTime.domain([
                d3.min(data, function (d) {
                    return d.Seconds - 10;
                }),
                d3.max(data, function (d) {
                    return d.Seconds + 10;
                })
            ]);

            svg
                .append('g')
                .attr('class', 'x axis')
                .attr('id', 'x-axis')
                .attr('transform', 'translate(0,' + graphHeight + ')')
                .call(xAxis);

            svg
                .append('text')
                .attr('x', 320)
                .attr('y', 540)
                .style('font-size', 20)
                .text('Year');

            svg
                .append('g')
                .attr('class', 'y axis')
                .attr('id', 'y-axis')
                .call(yAxis)
                .append('text')
                .attr('transform', 'rotate(-90)');

            svg
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('x', -300)
                .attr('y', -45)
                .style('font-size', 20)
                .text('Time (Seconds)');

            svg
                .selectAll('.dot')
                .data(data)
                .enter()
                .append('circle')
                .attr('class', 'dot')
                .attr('r', 10)
                .attr('cx', function (d) {
                    return xYear(d.Year);
                })
                .attr('cy', function (d) {
                    return yTime(d.Seconds);
                })
                .attr('data-xvalue', function (d) {
                    return d.Year;
                })
                .attr('data-yvalue', function (d) {
                    return d.Seconds;
                })
                .style('fill', function (d) {
                    return color(d.Doping !== '');
                })
                .on('mouseover', function (event, d) {
                    tooltipDiv.style('opacity', 1);
                    tooltipDiv.attr('data-year', d.Year);
                    tooltipDiv
                        .html(
                            d.Name +
                            ': ' +
                            d.Nationality +
                            '<br/>' +
                            'Year: ' +
                            d.Year +
                            '<br/>' +
                            'Time: ' +
                            d.Seconds + ' seconds' +
                            (d.Doping ? '<br/><br/>' + d.Doping : '')
                        )
                        .style('left', event.pageX + 10 + 'px')
                        .style('top', event.pageY + 'px');
                })
                .on('mouseout', function () {
                    tooltipDiv.style('opacity', 0);
                });

            var legendContainer = svg.append('g').attr('id', 'legend');

            var legend = legendContainer
                .selectAll('#legend')
                .data(color.domain())
                .enter()
                .append('g')
                .attr('class', 'legend-label')
                .attr('transform', function (d, i) {
                    return 'translate(0,' + (graphHeight / 2 - i * 20) + ')';
                });

            legend
                .append('rect')
                .attr('x', graphWidth - 20)
                .attr('width', 20)
                .attr('height', 20)
                .style('fill', color);

            legend
                .append('text')
                .attr('x', graphWidth - 30)
                .attr('y', 10)
                .attr('dy', '.25em')
                .style('text-anchor', 'end')
                .text(function (d) {
                    if (d) {
                        return 'Riders with doping allegations';
                    } else {
                        return 'Riders with no doping allegations';
                    }
                });
        })
        .catch((err) => console.log(err));
});
