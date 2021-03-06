// Based on https://www.datamuse.com/js/wordgraph.js

function getTargets(apiFn, sourceWord, max, response) {
    $.ajax({
            dataType: "json",
            type : 'Get',
            url: 'https://api.datamuse.com/words?' + apiFn + '=' + sourceWord + '&max=' + max,
            success: function(data) {
                response(sourceWord, $.map( data, function(item) { return item["word"]; }), apiFn);
            },
        });
}

var link;
var node;
var rect_width = 100;
var width = 500, height = 500;
var svg = d3.select("body").append("svg")
   .attr("width", width)
   .attr("height", height);
var nodes = {};

function response(sourceWord, followers, apiFn) {
    // STEP 1: clear old graph
    for (var n in nodes) {
        if (n != sourceWord) {
            delete nodes[n];
        }
    }
    svg.selectAll(".link").remove();
    svg.selectAll(".node").filter(function (n) {return n["name"] != sourceWord}).remove();
    svg.selectAll(".node").filter(function (n) {return n["name"] === sourceWord})
        .attr("class", "triggernode");
    svg.selectAll(".triggernode").remove();
    links = [];

    // STEP 2: render new links
    for (var i = 0; i < followers.length; i++) {
        links.push({source: sourceWord, target: followers[i], type: "rel_jjv"});
    }

    // STEP 3: Compute the distinct nodes from the links.
    links.forEach(function(link) {
            link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
            link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
    });

    // STEP 4: render new graph
    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(120)
        .charge(-1000)
        .on("tick", tick)
        .start();

    link = svg.selectAll(".link")
        .data(force.links())
        .enter().append("line")
        .attr("class", "link");

    node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", function(d,i) {if (d["name"]==sourceWord) return "triggernode"; else return "node";})
        .call(force.drag)
        .on("click", function(d,i) {click(d,i,sourceWord,apiFn);});

    node.append("rect")
        .attr("width", rect_width)
        .attr("height", 20)
        .attr("rx", 15)
        .attr("ry", 15);

    node.append("text")
        .attr("x", rect_width / 2 )
        .attr("dy", "1.0em")
        .text(function(d) { return d.name; });
}

function tick() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) { return "translate(" + (d.x-rect_width/2) + "," + d.y + ")"; });
}

function click(d, i, sourceWord, apiFn) {
    if (d["name"] != sourceWord) {
        var nextApiFn;
        if (apiFn == "rel_jjb") {
            nextApiFn = "rel_jja";
        } else {
            nextApiFn = "rel_jjb";
        }
        getTargets(nextApiFn, d["name"], 10, response);
    }
}

//rel_jjb: adjectives that are often used to describe the target word
//rel_jja: nouns that are often described by the adjective
getTargets("rel_jjb", "seedling", 10, response);
// getTargets("rel_jja", "transparent", 10, response);

// Excercise: Modify the code for other datamuse queries?
