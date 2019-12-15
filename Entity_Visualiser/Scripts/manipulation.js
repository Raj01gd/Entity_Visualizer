
//create somewhere to put the force directed graph
var svg = d3.select("svg").attr("width", window.outerWidth).attr("height", window.outerHeight),
    width = +svg.attr("width"),
    height = +svg.attr("height");
var nodeWidth = 80, nodeheight = 100;
    var nodes_data = nodes;

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "Column Name: <span style='color:white'>" + d.name + "</span><br/>Data Type :<span style='color:white'>" + d.dataType + "</span><br/>Is Primary Key: <span style='color:white'>" + iskey(d) + "</span>";
        })

    var tipLink = d3.tip()
        .attr('class', 'd3-tip')
        .offset([70, 10])
        .html(function (d) {
            return "Links: <span style='color:white'>" + d.source.Table + " is linked to " + d.target.Table + "</span>";
        })

    //set up the simulation 
    //nodes only for now 
    var simulation = d3.forceSimulation()
        //add nodes
        .nodes(nodes_data);
function iskey(d) {
    return (d.isIdentity == 1) ? "Yes" : "No";
}
    //add forces
    //we're going to add a charge to each node 
    //also going to add a centering force
simulation
    .force("charge_force", d3.forceManyBody().strength(-200))
    .force("center_force", d3.forceCenter(width / 2, height / 2));

//add tick instructions: 
simulation.on("tick", tickActions);


    //Time for the links 

    //Create links data 
    var links_data = links;



    //Create the link force 
    //We need the id accessor to use named sources and targets 

    var link_force = d3.forceLink(links_data)

        .id(function (d) { return d.Table; }).distance(300);

    //Add a links force to the simulation
    //Specify links  in d3.forceLink argument   


    simulation.force("links", link_force)

    //draw lines for the links 
    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links_data)
        .enter().append("line")
        .attr("stroke-width", 2).on('mouseover', tipLink.show)
        .on('mouseout', tipLink.hide)
        .call(tipLink);


    var node = svg.selectAll(".node_group")
        .data(nodes_data)

    //exit, remove
    node.exit().remove();
    //enter
    var enter = node.enter()
        .append("g").attr("class", "node_group");

    enter.append("rect")
        .attr("class", "node_rect")
        .attr("width", function (d) {
            if (d.Table.length > 6) {
                return nodeWidth + ((d.Table.length - 6) * 10);
            } else {
                return nodeWidth;
            }
        })
        .attr("height", function (d) {
            if (d.columns.length > 4) {
                return nodeheight + ((d.columns.length - 4) * 15);
            }
            else {
                return nodeheight;
            }
        })
        .attr("stroke", "black")
        .attr("fill", "white")
        .attr("rx", 5)
        .attr("ry", 5)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
enter.append("text")
    .text(function (d) { return d.Table; })
        .attr("class", "node_label")
        .attr("width", nodeWidth - 20)
        .attr("height", nodeheight - 80)
        .attr("fill", "blue");
    enter.append("line")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("class", "node_line");

    enter.each(function (d) {
        var texts = d3.select(this)
            .selectAll("label")
            .data(d.columns);
        texts.enter().append("text")
            .text(function (dc) {
                if (dc.name.length > d.Table.length) {
                    return dc.name.slice(0, 7) + "..";
                }
                return dc.name;
            })
            .attr('class', 'node_label1').on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .call(tip);
    });
    //merge

    node = node.merge(enter);



    function tickActions() {

        //update rectangle positions each tick of the simulation 
        node.selectAll(".node_rect")
            .attr("x", function (d) { return x = d.x; })
            .attr("y", function (d) { return y = d.y; });
        node.selectAll(".node_label")
            .attr("x", function (d) { return d.x + 2; })
            .attr("y", function (d) { return d.y + 20; });
        node.selectAll(".node_line")
            .attr("x1", function (d) { return d.x; })
            .attr("y1", function (d) { return d.y + 26; })
            .attr("x2", function (d) {
                if (d.Table.length > 6) {
                    return d.x + nodeWidth + ((d.Table.length - 6) * 10);
                } else {
                    return d.x + nodeWidth;
                }
            })
            .attr("y2", function (d) { return d.y + 26; });
        node.each(function (d) {
            var cnode = d3.select(this);
            var texts = cnode
                .selectAll('.node_label1');
            var x = JSON.parse(cnode.select('.node_label').attr('x'));
            var y = JSON.parse(cnode.select('.node_label').attr('y'));

            texts.attr('x', x).attr('y', (d, i) => y + 20 + (17 * i));

        })


        //update link positions 
        //simply tells one end of the line to follow one node around
        //and the other end of the line to follow the other node around
        link
            .attr("x1", function (d) { return d.source.x + 25; })
            .attr("y1", function (d) { return d.source.y + 50; })
            .attr("x2", function (d) { return d.target.x + 25; })
            .attr("y2", function (d) { return d.target.y + 50; });

    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

function dragged(d, i) {
    var rectwidth, rectheight;
    if (d.Table.length > 6) {
        rectwidth = nodeWidth + ((d.Table.length - 6) * 10);
    } else {
        rectwidth = nodeWidth;
    }
    if (d.columns.length > 4) {
        rectheight = nodeheight + ((d.columns.length - 4) * 15);
    }
    else {
        rectheight = nodeheight;
    }
    var left = d3.event.x
    if (left + rectwidth + 1 > width) {
        left = width - rectwidth - 1
    } else if (d3.event.x < 0) {
        left = 0
    }
    var top = d3.event.y
    if (top + rectheight + 1 > height) {
        top = height - rectheight - 1
    } else if (d3.event.y < 0) {
        top = 0
    }
    d.fx = left;
    d.fy = top;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
    }
    function releasenode(d) {
        d.fx = null;
        d.fy = null;
    }


