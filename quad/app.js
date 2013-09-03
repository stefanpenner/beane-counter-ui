var w = 960,
    h = 500,
    keyFunc = function(d) { return d.id; };

function sync(data) {
  var circles = d3.select("svg").selectAll("circle").data(data, keyFunc);
  var names = d3.select("svg").selectAll("text").data(data, keyFunc);
  var radius = 10;

  circles.enter().append("circle").
    attr("class", "player").
    attr("r", radius).
    on('click', function(a,b,c){
      var selected = d3.selectAll("circle.selected");

      selected.transition().delay(100).attr("r", radius);
      selected.classed("selected", false);

      var circle = d3.select(this);

      circle.classed("selected", true);
      circle.transition().attr("r", radius * 1.5);
  });

  names.enter().append("text").
    text(function(d) { return d.name(); });

  names.transition().
    attr("y", function(d){ return d.hotness + radius/2; }).
    attr("x", function(d){ return d.goodness + radius + 10; }).
    duration(500).ease("linear");

  circles.transition().
    attr("cy", function(d){ return d.hotness; }).
    attr("cx", function(d){ return d.goodness; }).
    duration(500).ease("linear");

  circles.exit().remove();
  names.exit().remove();
}

function by(value) {
  return function(entry) {
    return value * entry;
  }
}


var lastId = 1;
function Player() {
  this.id = lastId++;
}

Player.tick = function() {
  players(true).forEach(function(player){
    player.tick();
  });
};

Player.prototype = {
  tick: function() {
    this.hotness  = Math.random() * h;
    this.goodness = Math.random() * w;
  },
  name: function() {
    return "Players Name (" + this.id + ")";
  }
};

var _players = [
  new Player(),
  new Player(),
  new Player(),
  new Player(),
  new Player()
];

function players(mutate) {
  if (mutate) {
    _players.push(new Player());

    _players.splice(3, 1);
    //_players.shift();
  }
  return _players;
}

var svg = d3.select("body").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

// gradient
var defs = svg.append("svg:defs");

var backgroundLinearGradient = defs.append("svg:linearGradient").
  attr("id", "background-linear-gradient").
  attr("x1", "0%").
  attr("y1", "100%").
  attr("x2", "100%").
  attr("y2", "0%");

backgroundLinearGradient.append("svg:stop").
    attr("offset", "20%").
    attr("stop-color", "#0A4D65").
    attr("stop-opacity", 1);

backgroundLinearGradient.append("svg:stop").
    attr("offset", "80%").
    attr("stop-color", "#8D470B").
    attr("stop-opacity", 1);

var backgroundRadialGradient = defs.append("svg:radialGradient").
  attr("id", "background-radial-gradient").
  attr("cx", "50%").
  attr("cy", "50%").
  attr("r",  "50%").
  attr("fx", "50%").
  attr("fy", "50%");

backgroundRadialGradient.append("svg:stop").
    attr("offset", "0%").
    attr("stop-color", "black").
    attr("stop-opacity", 0.8);

backgroundRadialGradient.append("svg:stop").
    attr("offset", "100%").
    attr("stop-opacity", 0);

svg.append("svg:rect").
    attr("width", w).
    attr("height", h).
    style("fill", "url(#background-linear-gradient)");

svg.append("svg:rect").
    attr("width", w).
    attr("height", h).
    style("fill", "url(#background-radial-gradient)");
// \gradient

function random(collection){
  return collection[Math.floor(Math.random()*collection.length)]
}

function animate() {
  Player.tick();
  sync(players());
  setTimeout(animate, 1000);
}

animate();
