// src/visualization.js

console.log("d3.js force directed graph loaded.");

// Load JSON data from sample_data.json
d3.json("../data/sample_data.json").then(data => {
    console.log(data);

    // Specify the chart’s dimensions.
    const width = 2400;
    const height = 1200;

    // Compute the graph and start the force simulation.
    const root = d3.hierarchy(data);
    const links = root.links();
    const nodes = root.descendants();

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(20).strength(0.5))
        .force("charge", d3.forceManyBody().strength(-160))
        .force("x", d3.forceX(0.05))
        .force("y", d3.forceY(0.05));

    // Create the container SVG.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    // Append links.
    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 1.5)
        .selectAll("line")
        .data(links)
        .join("line")

    // Append nodes.
    const node = svg.append("g")
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 4.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("fill", d => d.children ? "lightblue" : "lightgreen")
        .attr("stroke", d => d.children ? "brown" : "#fff")
        .attr("r", 8.5)
        .call(drag(simulation));

    node.append("title")
        .text(d => d.data.name);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    // Basic Drag Function
    function drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    // Append the SVG to the visualization div.
    document.getElementById("visualization").appendChild(svg.node());
});

// src/visualization.js

// console.log("d3.js test loaded.");
//
// const svg = d3.select("#visualization")
//     .append("svg")
//     .attr("width", 200)
//     .attr("height", 100);
//
// svg.append("circle")
//     .attr("cx", 50)
//     .attr("cy", 50)
//     .attr("r", 40)
//     .attr("fill", "red");
//
// document.getElementById("visualization").appendChild(svg.node());