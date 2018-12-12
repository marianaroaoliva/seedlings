
// *****************************//
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

FONT_SIZE = 14;
DASH_STYLE = FONT_SIZE/2 + ", " + FONT_SIZE/2
SECTION_GAP = 50; // between two plants
GROUND_WIDTH = 400;

console.log(FONT_SIZE)

// ************** Generate the diagram  *****************
var margin = {top: 20, right: 50, bottom: 20, left: 50},
width = window.innerWidth - margin.right - margin.left,
height = 2000;

// var diagonal = d3.svg.diagonal()
//  .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
.attr("width", window.innerWidth + margin.right + margin.left)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + margin.left + "," + 0 + ")")
.attr("class","wrapper");


data = {
  "0":{
  "id": "0",
  "type":"gingko",
  "seed":"justice",
  "domain":"orange",
  "results":["sweet","immense","mysterious","deep","shoreless","eternal","warm","icy","blue"], //9
  "return":"mysterious"
  },
  "1":{
  "id": "1",
  "type":"pine",
  "seed":"spine",
  "domain":"jerusalem",
  "results":["sie", "sine", "snake", "serene", "spectre", "solstice", "sepulchre", "senescence","subordinate","subservience"], //9
  "return":"serene"
 },
  "2":{
    "id": "2",
    "type":"plant",
    "seed":"mysterious",
    "domain":"orange",
    "results":["|darkness", "/wickedness","unnatural|wickedness", "artificial\\","artificial|flowers", "/roses", "red|roses", "chromatic\\", "chromatic|colors", "/colours", "brown|colours", "browness\\", "uniform|brownness", "/consistent", "immortal|consistent","deathless\\", "burnt|deathless","destroyed\\", "destroyed|jerusalem"],
    "return":"jerusalem"
  },
  "3":{
    "id": "3",
    "type":"dandelion",
    "seed":"serene",
    "domain":"book",
    "results":["princess", "scenic", "majesty", "bright", "oasis", "meditative", "reigning","landscape", "atmosphere", "temple"],
    "return":"meditative"
  },
  "4":{
    "id": "4",
    "type":"ivy",
    "seed":"mysterious",
    "domain":"disaster",
    "results":["mysterious", "relaxation","processes","will","start","getting","sick"],
    "return":"jerusalem"
  }
}

drawGingko(data["0"],width/2,height-20)

drawPlant(data["2"],width/2, height-500)
drawPine(data["1"],520, height-1200)
drawDandelion(data["3"],520, height-1600)

drawIvy(data["4"],520, height-1800)

/**********************************/
function drawSeed(seed,x,y,g) {
  var h = seed.length*15;
  return g.append("text")
   .attr("x", x + FONT_SIZE/2)
   .attr("y", y - h + FONT_SIZE)
   .style("writing-mode", "tb")
   .attr("dy", ".35em")
   .text(seed)
   .attr("class","seed");
}

function drawDomain(domain,x,y,g) {
  g.append("text")
   .attr("x", x + FONT_SIZE/2)
   .attr("y", y + FONT_SIZE/2)
   .attr("dy", ".35em")
   .text(domain)
   .attr("class","domain");
}

function drawGround(x,y,g) {
  g.append("line")                 // attach a line
    .style("stroke", "black")         // colour the line
    .style("stroke-dasharray", DASH_STYLE)  // stroke-linecap type
    .attr("x1", x-GROUND_WIDTH/2)     // x position of the first end of the line
    .attr("y1", y)      // y position of the first end of the line
    .attr("x2", x+GROUND_WIDTH/2)     // x position of the second end of the line
    .attr("y2", y)    // y position of the second end of the line
    .attr("class","ground");
}

/**********************************/
function drawDandelion(data,x,y) {
  var LENGTH = WIDTH/3;

   var g = svg.append("g")
         .attr("class","dandelion seedling");
   drawGround(x,y,g);
   var seed = drawSeed(data["seed"],x,y,g);

    // MAIN BRANCH
    g.append("line")                 // attach a line
      .style("stroke", "black")         // colour the line
      .style("stroke-dasharray", DASH_STYLE)  // stroke-linecap type
      .attr("x1", x)     // x position of the first end of the line
      .attr("y1", y)      // y position of the first end of the line
      .attr("x2", x)     // x position of the second end of the line
      .attr("y2", y-LENGTH)    // y position of the second end of the line
      .attr("class","main_branch");
   drawDomain(data["domain"],x,y,g);

   y = y - 200;
   for (var i = 0; i < 30; i++) {

     var w = data["results"][i];
     var angle = 12*i + Math.random();
     // console.log(angle)
     l = i%2 ==0 ? LENGTH -20: LENGTH;

     // find the end point
     var endy = l * Math.sin(Math.radians(angle)) + y
     var endx = l * Math.cos(Math.radians(angle)) + x

     g.append("line")                 // attach a line
       .style("stroke", "black")
       .style("position", "absolute")         // colour the line
       .style("stroke-dasharray", DASH_STYLE)  // stroke-linecap type
       .attr("x1", x)     // x position of the first end of the line
       .attr("y1", y)      // y position of the first end of the line
       .attr("x2", endx)     // x position of the second end of the line
       .attr("y2", endy)     // y position of the second end of the line
       .attr("class","branch_line");
   }

   //drawText
   for (var i = 0; i < data["results"].length; i++) {

     var b = g.append("g")
            .attr("class","branch");
     var w = data["results"][i];
     var angle = 15*i;
     // console.log(angle)

     // find the end point
     var endy = LENGTH * Math.sin(Math.radians(angle)) + y
     var endx = LENGTH * Math.cos(Math.radians(angle)) + x

       b.append("text")
        // .attr("x", x)
        // .attr("y", y)
        // .style("transform", "translate(5px) rotate("+ (angle) +"deg) ")
        // .style("transform-origin", x + "px " + y + "px 0px")
        // .attr("dy", ".35em")
        // .text("            " + w )
        .attr("class","branch_text");
   }



}//End of dandelion

function drawIvy(data,x,y) {
  var g = svg.append("g")
         .attr("class","ivy seedling");

   g.append("line")
     .style("stroke", "black")         // colour the line
     .style("stroke-dasharray", DASH_STYLE)  // stroke-linecap type
     .attr("x1", x)     // x position of the first end of the line
     .attr("y1", y)      // y position of the first end of the line
     .attr("x2", x+GROUND_WIDTH)     // x position of the second end of the line
     .attr("y2", y)    // y position of the second end of the line
     .attr("class","ground");

  drawDomain(data["domain"],x+GROUND_WIDTH-150,y,g);

     function drawIvyStart(x1,y1,x2,y2,) {
       g.append("line")                 // attach a line
         .style("stroke", "black")         // colour the line
         .style("stroke-dasharray", DASH_STYLE)  // stroke-linecap type
         .attr("x1", x1)     // x position of the first end of the line
         .attr("y1", y1)      // y position of the first end of the line
         .attr("x2", x2)     // x position of the second end of the line
         .attr("y2", y2)    // y position of the second end of the line
         .attr("class","main_branch");

     } // MAIN BRANCH

   var xpointer = x;

   for (var i = 0; i < data["results"].length; i++) {
      var b = g.append("g")
             .attr("class","branch");
      var w = data["results"][i];
      var v = i%2 == 0 ? -1 :1;
      var xpointer = xpointer + FONT_SIZE*w.length*2/3;
      var ypos = y +(FONT_SIZE*v+Math.random()*15) - FONT_SIZE*3;

      if (i==0) {
        drawIvyStart(x+50,y+20,xpointer, ypos);
      }

      b.append("text")
       .attr("x", xpointer)
       .attr("y", ypos)
       .attr("dy", ".35em")
       .attr("text-anchor", "middle")
       .text(w )
       .attr("class","branch_text");
     }

} //End of Ivy

function drawPlant(data,x,y) {
  var g = svg.append("g")
         .attr("class","plant seedling");

   HEIGHT = 150;
  drawGround(x,y,g);
     // SEED
     var seed = drawSeed(data["seed"],x,y, g);

      // MAIN BRANCH
      g.append("line")                 // attach a line
        .style("stroke", "black")         // colour the line
        .style("stroke-dasharray", DASH_STYLE)  // stroke-linecap type
        .attr("x1", x)     // x position of the first end of the line
        .attr("y1", y)      // y position of the first end of the line
        .attr("x2", x)     // x position of the second end of the line
        .attr("y2", y-HEIGHT)    // y position of the second end of the line
        .attr("class","main_branch");

     drawDomain(data["domain"],x,y,g);

  for (var i = 0; i < data["results"].length; i++) {
    var b = g.append("g")
           .attr("class","branch");

    var w = data["results"][i];

    if (w.charAt(0) == "|" || w.charAt(0) == "/") {
      w = w.replace(/./g, ' ') + w;
    } else if (w.charAt(w.length-1) == "\\") {
      w =  w + w.replace(/./g, ' ');
    } else if (w.indexOf("|") > 0) {
      var ws = w.split("|");
      var mode = ws[1].length > ws[0].length
      var longer = mode ? ws[1]:ws[0];
      var shorter =  mode ? ws[0]:ws[1];
      var space = longer.slice(0,longer.length-shorter.length).replace(/./g, ' ');
      // console.log(ws, mode, space.length);

      w = mode ? space + ws[0] + "|" + ws[1] : ws[0] + "|" + ws[1] + space;
    }

    b.append("text")
     .attr("x", x - FONT_SIZE*1/4)
     .attr("y", y - FONT_SIZE*1.5*i - HEIGHT - FONT_SIZE)
     .attr("dy", ".35em")
     .attr("text-anchor", "middle")
     .text(w)
     .attr("class","branch_text");

  }

} //End of Plant

function drawPine(data,x,y) {
  var g = svg.append("g")
         .attr("class","pine seedling");

  WIDTH = 400;
  HEIGHT = 80;

  drawGround(x,y,g);

    // SEED
    var seed = g.append("text")
     .attr("x", x + FONT_SIZE/2)
     .attr("y", y - HEIGHT + FONT_SIZE)
     .style("writing-mode", "tb")
     .attr("dy", ".35em")
     .text(data["seed"])
     .attr("class","seed");

     // MAIN BRANCH
     g.append("line")                 // attach a line
       .style("stroke", "black")         // colour the line
       .style("stroke-dasharray", DASH_STYLE)  // stroke-linecap type
       .attr("x1", x)     // x position of the first end of the line
       .attr("y1", y)      // y position of the first end of the line
       .attr("x2", x)     // x position of the second end of the line
       .attr("y2", y-HEIGHT)    // y position of the second end of the line
       .attr("class","main_branch");

// DOMAIN
    g.append("text")
     .attr("x", x + FONT_SIZE/2)
     .attr("y", y + FONT_SIZE/2)
     .attr("dy", ".35em")
     .text(data["domain"])
     .attr("class","domain");

    data["results"].reverse();
    for (var i = 0; i < data["results"].length; i++) {
      var b = g.append("g")
             .attr("class","branch");
      var w = data["results"][i];

      b.append("text")
       .attr("x", x)
       .attr("y", y - FONT_SIZE*1.5*i - HEIGHT)
       .attr("dy", ".35em")
       .attr("text-anchor", "middle")
       .text(w )
       .attr("class","branch_text");
    }

} //End of pine

function drawGingko(data,x,y) {

  var g = svg.append("g")
         .attr("class","ginko seedling");

  var WIDTH = 400,
  START_ANGLE = -160 + Math.floor(Math.random()*60),
  HEIGHT =  WIDTH/2 - Math.floor(Math.random()*60),
  LENGTH = WIDTH/2;

drawGround(x,y,g)
// SEED
var seed = drawSeed(data["seed"],x,y,g)
console.log(seed)
// MAIN BRANCH
g.append("line")                 // attach a line
  .style("stroke", "black")         // colour the line
  .style("stroke-dasharray", DASH_STYLE)  // stroke-linecap type
  .attr("x1", x)     // x position of the first end of the line
  .attr("y1", y)      // y position of the first end of the line
  .attr("x2", x)     // x position of the second end of the line
  .attr("y2", y-HEIGHT)    // y position of the second end of the line
  .attr("class","main_branch");

drawDomain(data["domain"],x,y,g)

// BRANCHES
y = y-HEIGHT; //move to center

for (var i = 0; i < data["results"].length; i++) {

  var b = g.append("g")
         .attr("class","branch");
  var w = data["results"][i];
  var angle = 15*i+START_ANGLE;
  // console.log(angle)

  // find the end point
  var endy = LENGTH * Math.sin(Math.radians(angle)) + y
  var endx = LENGTH * Math.cos(Math.radians(angle)) + x

  b.append("line")                 // attach a line
    .style("stroke", "black")
    .style("position", "absolute")         // colour the line
    .style("stroke-dasharray", DASH_STYLE)  // stroke-linecap type
    .attr("x1", x)     // x position of the first end of the line
    .attr("y1", y)      // y position of the first end of the line
    .attr("x2", endx)     // x position of the second end of the line
    .attr("y2", endy)     // y position of the second end of the line
    .attr("class","branch_line");

    b.append("text")
     .attr("x", x)
     .attr("y", y)
     .style("transform", "translate(5px) rotate("+ (angle) +"deg) ")
     .style("transform-origin", x + "px " + y + "px 0px")
     .attr("dy", ".35em")
     .text("            " + w )
     .attr("class","branch_text");
}

} // END OF Ginko
