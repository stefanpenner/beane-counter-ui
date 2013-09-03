var w = 750,
    h = 500,
    get = Ember.get;

function playerKey(player) {
  return get(player, 'name');
}

var Quadrant = Ember.Component.extend({

  selectedPlayer: null,

  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, 'renderGraph');
  },

  renderGraph: function() {

    var $container = this.$().find('.quadrant-container');
    createSVG($container.get(0));

    this.$popup = this.$().find('.quadrant-popup');

    this.dataChanged();
  },

  dataChanged: function() {
    var svg = this.$().find('svg').get(0),
        players = this.get('players');

    var circles = d3.select(svg).selectAll("circle").data(players, playerKey);
    var names = d3.select(svg).selectAll("text").data(players, playerKey);
    var radius = 10;


    var self = this;

    circles.enter().append("circle").
      attr("class", "player").
      attr("r", radius).
      on('click', function(clickedPlayer,b,c){

        var selected = d3.selectAll("circle.selected");

        selected.transition().delay(100).attr("r", radius);
        selected.classed("selected", false);

        if (self.get('selectedPlayer') === clickedPlayer) {
          // Deselect
          self.set('selectedPlayer', null);
          return;
        }

        var circle = d3.select(this);

        circle.classed("selected", true);
        circle.transition().attr("r", radius * 1.5);

        self.set('selectedPlayer', clickedPlayer);
        self.updatePopupLocation(d3.select(this).attr('cx'),
                                 d3.select(this).attr('cy'));
    });

    names.enter().append("text").
      text(function(d) { return get(d, 'name'); });

    names.transition().
      attr("y", function(d){ return d.hotness * h + radius/2; }).
      attr("x", function(d){ return d.goodness * w + radius + 10; }).
      duration(2500).ease("linear");

    circles.transition().
      attr("cy", function(d){ return d.hotness * h; }).
      attr("cx", function(d){ return d.goodness * w; }).

      tween("borf", function(d) {

        // TODO: shared tween method? Some better way if hooking into this?
        var initX = parseInt(d3.select(this).attr('cx'));
        var initY = parseInt(d3.select(this).attr('cy'));

        return function(t) {
          var selectedPlayer = self.get('selectedPlayer');

          if (selectedPlayer && selectedPlayer.name === d.name) {
            self.updatePopupLocation(initX + t * (d.goodness * w - initX),
                                     initY + t * (d.hotness * h - initY));
          }
        };
      }).

      duration(2500).ease("linear");

    circles.exit().remove();
    names.exit().remove();
  }.observes('players.[]'),

  teardownGraph: function() {
    // TODO: what kind of teardown does d3 need?
  }.on('willDestroyElement'),

  updatePopupLocation: function(x, y) {
    this.$popup.css('left', Math.floor(x) + 'px');
    this.$popup.css('top', Math.floor(y) + 'px');
  }
});


function createSVG(parentElement) {
  var svg = d3.select(parentElement).append("svg:svg")
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
}

export default Quadrant;
