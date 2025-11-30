import * as d3 from 'd3';
import { translateCrimeType, translateLocation } from './translations';

const margins = { left: 60, right: 30, top: 30, bottom: 60 };

// Helper function to get SVG dimensions
function getSvgDimensions(svg) {
    const width = +svg.style("width").split("px")[0] - margins.left - margins.right;
    const height = +svg.style("height").split("px")[0] - margins.top - margins.bottom;
    return { width, height };
}

// Helper function to convert BigInt to number
function toNumber(value) {
    if (typeof value === 'bigint') {
        return Number(value);
    }
    return value;
}

// Helper function to create tooltip
function createTooltip() {
    return d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
}

// Chart: Crimes por Hora
export function chartByHour(data, svgId) {
    const svg = d3.select(`#${svgId}`);
    svg.selectAll("*").remove();

    const { width, height } = getSvgDimensions(svg);
    const g = svg.append('g')
        .attr('transform', `translate(${margins.left},${margins.top})`);

    // Ensure numeric values
    data = data.map(d => ({
        hour: toNumber(d.hour),
        count: toNumber(d.count)
    }));

    // Scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.hour))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([height, 0]);

    // Tooltip
    const tooltip = createTooltip();

    // Bars
    g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.hour))
        .attr('y', d => yScale(d.count))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.count))
        .on('mouseover', function(event, d) {
            tooltip.transition().duration(200).style('opacity', 1);
            tooltip.html(`Hora: ${d.hour}:00<br>Crimes: ${d.count.toLocaleString()}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px')
                .classed('visible', true);
        })
        .on('mouseout', function() {
            tooltip.transition().duration(200).style('opacity', 0);
        });

    // Axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d => `${d}:00`);
    const yAxis = d3.axisLeft(yScale).tickFormat(d => d3.format('.2s')(d));

    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

    g.append('g')
        .attr('class', 'axis')
        .call(yAxis);

    // Labels
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${width / 2}, ${height + 40})`)
        .style('text-anchor', 'middle')
        .text('Hora do Dia');

    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -height / 2)
        .style('text-anchor', 'middle')
        .text('Número de Crimes');
}

// Chart: Crimes por Dia da Semana
export function chartByDay(data, svgId) {
    const svg = d3.select(`#${svgId}`);
    svg.selectAll("*").remove();

    const { width, height } = getSvgDimensions(svg);
    const g = svg.append('g')
        .attr('transform', `translate(${margins.left},${margins.top})`);

    // Ensure numeric values
    data = data.map(d => ({
        day_name: d.day_name,
        day_num: toNumber(d.day_num),
        count: toNumber(d.count)
    }));

    // Scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.day_name))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([height, 0]);

    const tooltip = createTooltip();

    // Bars
    g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.day_name))
        .attr('y', d => yScale(d.count))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.count))
        .on('mouseover', function(event, d) {
            tooltip.transition().duration(200).style('opacity', 1);
            tooltip.html(`${d.day_name}<br>Crimes: ${d.count.toLocaleString()}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px')
                .classed('visible', true);
        })
        .on('mouseout', function() {
            tooltip.transition().duration(200).style('opacity', 0);
        });

    // Axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).tickFormat(d => d3.format('.2s')(d)));

    // Labels
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${width / 2}, ${height + 40})`)
        .style('text-anchor', 'middle')
        .text('Dia da Semana');

    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -height / 2)
        .style('text-anchor', 'middle')
        .text('Número de Crimes');
}

// Chart: Crimes por Mês
export function chartByMonth(data, svgId) {
    const svg = d3.select(`#${svgId}`);
    svg.selectAll("*").remove();

    const { width, height } = getSvgDimensions(svg);
    const g = svg.append('g')
        .attr('transform', `translate(${margins.left},${margins.top})`);

    // Ensure numeric values
    data = data.map(d => ({
        month: toNumber(d.month),
        month_name: d.month_name,
        count: toNumber(d.count)
    }));

    // Scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.month_name))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([height, 0]);

    const tooltip = createTooltip();

    // Bars
    g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.month_name))
        .attr('y', d => yScale(d.count))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.count))
        .on('mouseover', function(event, d) {
            tooltip.transition().duration(200).style('opacity', 1);
            tooltip.html(`${d.month_name}<br>Crimes: ${d.count.toLocaleString()}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px')
                .classed('visible', true);
        })
        .on('mouseout', function() {
            tooltip.transition().duration(200).style('opacity', 0);
        });

    // Axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).tickFormat(d => d3.format('.2s')(d)));

    // Labels
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${width / 2}, ${height + 40})`)
        .style('text-anchor', 'middle')
        .text('Mês');

    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -height / 2)
        .style('text-anchor', 'middle')
        .text('Número de Crimes');
}

// Chart: Crimes por Mês, separados por ano e apenas na Rua (Line Chart)
export function chartByMonthLine(data, svgId) {
    const svg = d3.select(`#${svgId}`);
    svg.selectAll("*").remove();

    const { width, height } = getSvgDimensions(svg);
    const g = svg.append("g")
        .attr("transform", `translate(${margins.left},${margins.top})`);

    // Garantir números
    data = data.map(d => ({
        year: toNumber(d.year),
        month: toNumber(d.month),
        month_name: d.month_name,
        count: toNumber(d.count)
    }));

    // ---- AGRUPAR POR ANO ----
    const years = Array.from(new Set(data.map(d => d.year))).sort();
    const dataByYear = d3.group(data, d => d.year);

    // Escalas
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.month_name))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([height, 0]);

    // 🎨 Paleta automática (10 cores)
    // Você pode trocar para d3.schemeCategory10 se preferir.
    const color = d3.scaleOrdinal()
        .domain(years)
        .range(d3.schemeTableau10);

    const tooltip = createTooltip();

    // Gerador da linha SEM suavização
    const line = d3.line()
        .x(d => xScale(d.month_name) + xScale.bandwidth() / 2)
        .y(d => yScale(d.count));

    // ---- DESENHAR LINHAS PARA CADA ANO ----
    years.forEach(year => {
        const yearData = dataByYear.get(year).sort((a, b) => a.month - b.month);

        // Linha
        g.append("path")
            .datum(yearData)
            .attr("fill", "none")
            .attr("stroke", color(year))
            .attr("stroke-width", 2)
            .attr("d", line);

        // Pontos
        g.selectAll(`.point-${year}`)
            .data(yearData)
            .enter()
            .append("circle")
            .attr("class", `point point-${year}`)
            .attr("cx", d => xScale(d.month_name) + xScale.bandwidth() / 2)
            .attr("cy", d => yScale(d.count))
            .attr("r", 4)
            .attr("fill", color(year))
            .on("mouseover", function(event, d) {
                tooltip.style("opacity", 1);
                tooltip.html(`${d.month_name}/${d.year}<br>Crimes: ${d.count.toLocaleString()}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px")
                    .classed("visible", true);
            })
            .on("mouseout", function() {
                tooltip.style("opacity", 0);
            });
    });

    // ---- EIXOS ----
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(d3.format(".2s")));

    // Labels
    g.append("text")
        .attr("class", "axis-label")
        .attr("transform", `translate(${width / 2}, ${height + 40})`)
        .style("text-anchor", "middle")
        .text("Mês");

    g.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -height / 2)
        .style("text-anchor", "middle")
        .text("Número de Crimes");

    // ---- LEGENDA NA PARTE INFERIOR ----

    // Distância vertical abaixo do eixo X
    const legendY = height + 25;

    // Agrupamento da legenda
    const legend = g.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width / 2 - 400}, ${legendY})`)
        .style("text-anchor", "middle");

    // Cada item da legenda
    years.forEach((year, i) => {
        const row = legend.append("g")
            .attr("transform", `translate(${(i - years.length / 2) * 70}, 0)`);

        // Quadradinho de cor
        row.append("rect")
            .attr("width", 16)
            .attr("height", 16)
            .attr("fill", color(year));

        // Texto
        row.append("text")
            .attr("x", 34)
            .attr("y", 13)
            .style("font-size", "14px")
            .style("font-weight", "bold")  
            .style("fill", "#000")        
            .text(year);
    });

}

// Chart: Timeline (Série Temporal)
export function chartTimeline(data, svgId) {
    const svg = d3.select(`#${svgId}`);
    svg.selectAll("*").remove();

    const { width, height } = getSvgDimensions(svg);
    const g = svg.append('g')
        .attr('transform', `translate(${margins.left},${margins.top})`);

    // Ensure numeric values and parse dates
    const parseDate = d3.timeParse("%Y-%m-%d");
    data = data.map(d => {
        const count = toNumber(d.count);
        let date;
        
        if (typeof d.date === 'string') {
            date = parseDate(d.date) || new Date(d.date);
        } else if (d.date instanceof Date) {
            date = d.date;
        } else {
            date = new Date(d.date);
        }
        
        return { date, count };
    });
    
    // Filter out invalid dates
    data = data.filter(d => d.date && !isNaN(d.date.getTime()));

    // Scales
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([height, 0]);

    // Line generator
    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.count))
        .curve(d3.curveMonotoneX);

    // Area generator
    const area = d3.area()
        .x(d => xScale(d.date))
        .y0(height)
        .y1(d => yScale(d.count))
        .curve(d3.curveMonotoneX);

    // Add area
    g.append('path')
        .datum(data)
        .attr('class', 'area')
        .attr('d', area);

    // Add line
    g.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line);

    const tooltip = createTooltip();

    // Add dots
    g.selectAll('.dot')
        .data(data.filter((d, i) => i % Math.ceil(data.length / 50) === 0)) // Sample for performance
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yScale(d.count))
        .attr('r', 3)
        .on('mouseover', function(event, d) {
            tooltip.transition().duration(200).style('opacity', 1);
            tooltip.html(`${d3.timeFormat("%d/%m/%Y")(d.date)}<br>Crimes: ${d.count.toLocaleString()}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px')
                .classed('visible', true);
        })
        .on('mouseout', function() {
            tooltip.transition().duration(200).style('opacity', 0);
        });

    // Axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.timeFormat("%b %Y")));

    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).tickFormat(d => d3.format('.2s')(d)));

    // Labels
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${width / 2}, ${height + 40})`)
        .style('text-anchor', 'middle')
        .text('Data');

    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -height / 2)
        .style('text-anchor', 'middle')
        .text('Número de Crimes');
}

// Chart: Top Primary Types (Horizontal Bar)
export function chartTopPrimaryTypes(data, svgId) {
    const svg = d3.select(`#${svgId}`);
    svg.selectAll("*").remove();

    const { width, height } = getSvgDimensions(svg);
    const g = svg.append('g')
        .attr('transform', `translate(${margins.left},${margins.top})`);

    // Ensure numeric values and translate
    data = data.map(d => ({
        primary_type: translateCrimeType(d.primary_type),
        count: toNumber(d.count)
    }));

    // Scales
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([0, width]);

    const yScale = d3.scaleBand()
        .domain(data.map(d => d.primary_type))
        .range([0, height])
        .padding(0.1);

    const tooltip = createTooltip();

    // Bars
    g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', d => yScale(d.primary_type))
        .attr('width', d => xScale(d.count))
        .attr('height', yScale.bandwidth())
        .on('mouseover', function(event, d) {
            tooltip.transition().duration(200).style('opacity', 1);
            tooltip.html(`${d.primary_type}<br>Crimes: ${d.count.toLocaleString()}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px')
                .classed('visible', true);
        })
        .on('mouseout', function() {
            tooltip.transition().duration(200).style('opacity', 0);
        });

    // Labels on bars
    g.selectAll('.bar-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'bar-label')
        .attr('x', d => xScale(d.count) + 5)
        .attr('y', d => yScale(d.primary_type) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .style('font-size', '11px')
        .text(d => d3.format('.2s')(d.count));

    // Axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d => d3.format('.2s')(d)));

    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale));

    // Labels
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${width / 2}, ${height + 40})`)
        .style('text-anchor', 'middle')
        .text('Número de Crimes');
}

// Chart: Top Locations (Horizontal Bar)
export function chartTopLocations(data, svgId) {
    const svg = d3.select(`#${svgId}`);
    svg.selectAll("*").remove();

    const { width, height } = getSvgDimensions(svg);
    const g = svg.append('g')
        .attr('transform', `translate(${margins.left},${margins.top})`);

    // Ensure numeric values and translate
    data = data.map(d => ({
        location: translateLocation(d.location),
        count: toNumber(d.count)
    }));

    // Scales
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([0, width]);

    const yScale = d3.scaleBand()
        .domain(data.map(d => d.location))
        .range([0, height])
        .padding(0.1);

    const tooltip = createTooltip();

    // Bars
    g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', d => yScale(d.location))
        .attr('width', d => xScale(d.count))
        .attr('height', yScale.bandwidth())
        .on('mouseover', function(event, d) {
            tooltip.transition().duration(200).style('opacity', 1);
            tooltip.html(`${d.location}<br>Crimes: ${d.count.toLocaleString()}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px')
                .classed('visible', true);
        })
        .on('mouseout', function() {
            tooltip.transition().duration(200).style('opacity', 0);
        });

    // Labels on bars
    g.selectAll('.bar-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'bar-label')
        .attr('x', d => xScale(d.count) + 5)
        .attr('y', d => yScale(d.location) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .style('font-size', '11px')
        .text(d => d3.format('.2s')(d.count));

    // Axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d => d3.format('.2s')(d)));

    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale));

    // Labels
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${width / 2}, ${height + 40})`)
        .style('text-anchor', 'middle')
        .text('Número de Crimes');
}

// Chart: Pie Chart for Arrest Distribution
export function chartPie(data, svgId, label) {
    const svg = d3.select(`#${svgId}`);
    svg.selectAll("*").remove();

    const { width, height } = getSvgDimensions(svg);
    const radius = Math.min(width, height) / 2 - 40;

    const g = svg.append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

    // Ensure numeric values
    const key = Object.keys(data[0] || {})[0];
    data = data.map(d => {
        const result = { ...d };
        result.count = toNumber(d.count);
        return result;
    });

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d[key]))
        .range(['#667eea', '#764ba2', '#f093fb', '#4facfe']);

    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const arcLabel = d3.arc()
        .innerRadius(radius + 20)
        .outerRadius(radius + 20);

    const tooltip = createTooltip();

    const arcs = g.selectAll('.arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc');

    arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data[Object.keys(d.data)[0]]))
        .on('mouseover', function(event, d) {
            tooltip.transition().duration(200).style('opacity', 1);
            const key = Object.keys(d.data)[0];
            tooltip.html(`${d.data[key]}<br>${d.data.count.toLocaleString()} (${((d.data.count / d3.sum(data, d => d.count)) * 100).toFixed(1)}%)`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px')
                .classed('visible', true);
        })
        .on('mouseout', function() {
            tooltip.transition().duration(200).style('opacity', 0);
        });

    arcs.append('text')
        .attr('transform', d => `translate(${arcLabel.centroid(d)})`)
        .attr('dy', '0.35em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(d => {
            const key = Object.keys(d.data)[0];
            return d.data[key];
        });
}

// Chart: Crimes por Distrito
export function chartByDistrict(data, svgId) {
    const svg = d3.select(`#${svgId}`);
    svg.selectAll("*").remove();

    const { width, height } = getSvgDimensions(svg);
    const g = svg.append('g')
        .attr('transform', `translate(${margins.left},${margins.top})`);

    // Ensure numeric values
    data = data.map(d => ({
        district: String(d.district),
        count: toNumber(d.count)
    }));

    // Scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.district))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([height, 0]);

    const tooltip = createTooltip();

    // Bars
    g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.district))
        .attr('y', d => yScale(d.count))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.count))
        .on('mouseover', function(event, d) {
            tooltip.transition().duration(200).style('opacity', 1);
            tooltip.html(`Distrito: ${d.district}<br>Crimes: ${d.count.toLocaleString()}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px')
                .classed('visible', true);
        })
        .on('mouseout', function() {
            tooltip.transition().duration(200).style('opacity', 0);
        });

    // Axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).tickFormat(d => d3.format('.2s')(d)));

    // Labels
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${width / 2}, ${height + 40})`)
        .style('text-anchor', 'middle')
        .text('Distrito');

    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -height / 2)
        .style('text-anchor', 'middle')
        .text('Número de Crimes');
}

// Chart: Arrest by Primary Type (Grouped Bar)
export function chartArrestByType(data, svgId) {
    const svg = d3.select(`#${svgId}`);
    svg.selectAll("*").remove();

    const { width, height } = getSvgDimensions(svg);
    const g = svg.append('g')
        .attr('transform', `translate(${margins.left},${margins.top})`);

    // Ensure numeric values and translate
    data = data.map(d => ({
        primary_type: translateCrimeType(d.primary_type),
        with_arrest: toNumber(d.with_arrest),
        without_arrest: toNumber(d.without_arrest),
        total: toNumber(d.total)
    }));

    // Prepare data for grouped bars
    const types = data.map(d => d.primary_type);
    const x0Scale = d3.scaleBand()
        .domain(types)
        .range([0, width])
        .padding(0.1);

    const x1Scale = d3.scaleBand()
        .domain(['with_arrest', 'without_arrest'])
        .range([0, x0Scale.bandwidth()])
        .padding(0.05);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.with_arrest, d.without_arrest))])
        .nice()
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(['with_arrest', 'without_arrest'])
        .range(['#667eea', '#f093fb']);

    const tooltip = createTooltip();

    // Create groups for each type
    const typeGroups = g.selectAll('.type-group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'type-group')
        .attr('transform', d => `translate(${x0Scale(d.primary_type)},0)`);

    // Add bars for each group
    typeGroups.selectAll('.bar')
        .data(d => [
            { key: 'with_arrest', value: d.with_arrest, type: d.primary_type },
            { key: 'without_arrest', value: d.without_arrest, type: d.primary_type }
        ])
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x1Scale(d.key))
        .attr('y', d => yScale(d.value))
        .attr('width', x1Scale.bandwidth())
        .attr('height', d => height - yScale(d.value))
        .attr('fill', d => color(d.key))
        .on('mouseover', function(event, d) {
            tooltip.transition().duration(200).style('opacity', 1);
            const label = d.key === 'with_arrest' ? 'Com Prisão' : 'Sem Prisão';
            tooltip.html(`${d.type}<br>${label}: ${d.value.toLocaleString()}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px')
                .classed('visible', true);
        })
        .on('mouseout', function() {
            tooltip.transition().duration(200).style('opacity', 0);
        });

    // Axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x0Scale))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');

    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).tickFormat(d => d3.format('.2s')(d)));

    // Legend
    const legend = g.append('g')
        .attr('transform', `translate(${width - 100}, 20)`);

    const legendData = [
        { label: 'Com Prisão', color: color('with_arrest') },
        { label: 'Sem Prisão', color: color('without_arrest') }
    ];

    legend.selectAll('.legend-item')
        .data(legendData)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legend.selectAll('.legend-item')
        .append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', d => d.color);

    legend.selectAll('.legend-item')
        .append('text')
        .attr('x', 20)
        .attr('y', 12)
        .style('font-size', '12px')
        .text(d => d.label);

    // Labels
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${width / 2}, ${height + 50})`)
        .style('text-anchor', 'middle')
        .text('Tipo de Crime');

    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -height / 2)
        .style('text-anchor', 'middle')
        .text('Número de Crimes');
}

// Clear all charts
export function clearAllCharts() {
    d3.selectAll('svg').selectAll('*').remove();
    d3.selectAll('.tooltip').remove();
}

