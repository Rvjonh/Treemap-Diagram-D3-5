async function runAsync() {
    const gameData = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
        .then(res => res.json())
        .catch(err => console.log(err))

    const width = 1400;
    const height = 1000;

    colorsArray = [
        'rgb(76, 146, 195)', 'rgb(255, 201, 147)', 'rgb(222, 82, 83)', 'rgb(209, 192, 221)',
        'rgb(233, 146, 206)', 'rgb(210, 210, 210)', 'rgb(190, 210, 237)', 'rgb(86, 179, 86)',
        'rgb(255, 173, 171)', 'rgb(163, 120, 111)', 'rgb(249, 197, 219)', 'rgb(201, 202, 78)',
        'rgb(255, 153, 62)', 'rgb(173, 229, 161)', 'rgb(169, 133, 202)', 'rgb(208, 176, 169)',
        'rgb(153, 153, 153)', 'rgb(226, 226, 164)'
    ];

    const treemap = (data) => d3.treemap()
        .size([width, height])
        .padding(1)
        (d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value)
        )

    const root = treemap(gameData);

    const svg = d3.select('#graph')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, 1400])
        .style('background-color', 'white')

    const leaf = svg.selectAll('g')
        .data(root.leaves())
        .join('g')
        .attr('transform', d => `translate(${d.x0}, ${d.y0})`)

    const categoryArray = [
        'Wii', 'GB', 'PS2', 'SNES', 'GBA', '2600',
        'DS', 'PS3', '3DS', 'PS', 'XB', 'PSP',
        'X360', 'NES', 'PS4', 'N64', 'PC', 'XOne'
    ];


    leaf.append('rect')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('class', 'tile')
        .attr('data-name', d => d.data.name)
        .attr('data-category', d => d.data.category)
        .attr('data-value', d => d.data.value)
        .attr('fill', d => {
            index = categoryArray.findIndex(i => i === d.data.category);
            if (index >= 0 && index < colorsArray.length) {
                return colorsArray[index];
            }
        })
        .on('mouseover', mouseoverEvent)
        .on('mouseout', mouseoutEvent)

    function mouseoverEvent(e, d) {
        const videoGame = d;

        d3.select('#tooltip')
            .attr('data-name', videoGame.data.name)
            .attr('data-category', videoGame.data.category)
            .attr('data-value', videoGame.data.value)
            .style('visibility', 'visible')
            .style('left', e.pageX + 'px')
            .style('top', e.pageY + 'px')

        d3.select('#tooltipdata1')
            .text(`Name: ${videoGame.data.name}`)

        d3.select('#tooltipdata2')
            .text(`Category: ${videoGame.data.category}`)

        d3.select('#tooltipdata3')
            .text(`Value: ${videoGame.data.value}`)
    }
    function mouseoutEvent(e, d) {
        d3.select('#tooltip')
            .style('visibility', 'hidden')
    }

    leaf.append('text')
        .style('font-size', '1em')
        .attr('x', 0)
        .attr('y', 32)
        .style('white-space', 'nowrap')
        .text((d) => d.data.name)
        .on('mouseover', mouseoverEvent)
        .on('mouseout', mouseoutEvent)


    const legend = svg.append('g')
        .attr('id', 'legend')
        .attr('transform', 'translate(' + ((width - 600) / 2) + ', 1000)')
        .attr('width', 600)
        .attr('height', 300)
        .style('background-color', 'blue')


    legend.selectAll('rect')
        .data(colorsArray)
        .enter()
        .append('rect')
        .attr('class', 'legend-item')
        .attr('width', 20)
        .attr('height', 20)
        .attr('x', (d, i) => {
            if (i >= 6 && i <= 11) {
                return 200;
            }
            if (i > 11) {
                return 400;
            }
        })
        .attr('y', (d, i) => {
            if (i < 6) {
                return i * 50;
            }
            if (i >= 6 && i <= 11) {
                return (i - 6) * 50;
            }
            if (i > 11) {
                return (i - 12) * 50;
            }
        })
        .style('fill', d => d)


    d3.select('#legend')
        .selectAll('text')
        .data(categoryArray)
        .enter()
        .append('text')
        .attr('x', (d, i) => {
            if (i >= 6 && i <= 11) {
                return 225;
            }
            if (i > 11) {
                return 425;
            }
            return 25
        })
        .attr('y', (d, i) => {
            if (i < 6) {
                return i * 50 + 15;
            }
            if (i >= 6 && i <= 11) {
                return (i - 6) * 50 + 15;
            }
            if (i > 11) {
                return (i - 12) * 50 + 15;
            }
        })
        .text(d => d)

    const tooltip = d3.select('#graph')
        .append('div')
        .attr('id', 'tooltip')
        .attr('width', '150px')
        .attr('height', '120px')
        .style('opacity', .85)
        .style('visibility', 'hidden')
        .style('z-index', 1)
        .style('flex-direction', 'column')
        .style('align-items', 'center')
        .style('position', 'absolute')
        .style('border-radius', '5px')
        .style('padding', '5px')
        .style('text-align', 'center')
        .attr('class', 'car-tooltip');

    const tooltipData1 = d3.select('#tooltip')
        .append('div')
        .attr('id', 'tooltipdata1')
        .attr('width', '150px')
        .attr('height', '40px')

    const tooltipData2 = d3.select('#tooltip')
        .append('div')
        .attr('id', 'tooltipdata2')
        .attr('width', '150px')
        .attr('height', '40px')

    const tooltipData3 = d3.select('#tooltip')
        .append('div')
        .attr('id', 'tooltipdata3')
        .attr('width', '150px')
        .attr('height', '40px')

}
runAsync();