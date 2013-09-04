var w = 750,
    h = 500,
    radius = 5,
    get = Ember.get;

function playerKey(player) {
  return get(player, 'name');
}

function appendPlayers(players, component) {

  players.
    append('text').
      classed('name', true).
      attr('x', radius * 1.5 + 5).
      attr('y', radius / 1).
      text(function(player) { return player.name; });

  players.
    append('circle').
      classed('player', true).
      attr('r', radius);

  players.
    on('click', function(d, i) {
      clickPlayer.call(this, d, component);
  });
}

function clickPlayer(playerData, component) {
  // TODO: less truth in DOM...
  // maybe use events to decouple "component" from this callback.
  var player = d3.select(this);
  var circle = player.select('circle');
  var text = player.select('text');

  if (player.classed('selected')) {
    // Deselect
    component.selectedSvgGroup = null;
    component.set('selectedPlayer', null);

    player.classed('selected', false);
    circle.transition().attr('r', radius);
    text.transition().attr('x', radius * 1.5 + 5);
  } else {
    // Select
    var selected = d3.selectAll('g.selected');

    selected.select('circle').transition().delay(100).attr('r', radius);
    selected.select('text').transition().attr('x', radius * 1.5 + 5);
    selected.classed('selected', false);

    player.classed('selected', true);
    circle.transition().attr('r', radius * 1.5);
    player.select('text').transition().attr('x', radius * 1.5 + 10);

    // Save reference to both currently selected player,
    // and the svg element, so that we can have the popup
    // track the location of the selected circle.
    component.selectedSvgGroup = this;
    component.set('selectedPlayer', playerData);

    component.updatePopupLocation();
  }
}

var Quadrant = Ember.Component.extend({

  selectedPlayer: null,

  renderGraph: function() {

    var $container = this.$().find('.quadrant-container');
    createSVG($container.get(0));

    this.$popup = this.$().find('.quadrant-popup');
    this.xscale = d3.scale.linear().
      domain([0, 1]).
      range([0, w]);

    this.yscale = d3.scale.linear().
      domain([0, 1]).
      range([h, 0]);

    var self = this;

    function step(t) {
      self.updatePopupLocation();
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);

    this.dataDidChange();
  }.on('didInsertElement'),

  renderD3: function() {
    var svg = d3.select(this.$('svg')[0]);
    var data = this.get('players');
    var component = this;

    var xscale = this.xscale;
    var yscale = this.yscale;

    var players = svg.
      selectAll('g.player').
      data(data, function(player, index) {
        return player.name;
    });

    players.exit().remove();
    players.enter().
      append('g').
      classed('player', true).
        attr('y', 0).
        attr('x', 0).call(appendPlayers, component);

    players.transition().
      duration(1000).
      attr('data-id', function(d) { return d.name; }).
      attr('transform', function(player, index) {
        return 'translate(' + xscale(player.goodness) + ', ' + yscale(player.hotness) + ')';
    });
  },

  dataDidChange: function() {
    Ember.run.scheduleOnce('afterRender', this, 'renderD3');
  }.observes('players.[]'),

  teardownGraph: function() {
    // TODO: what kind of teardown does d3 need?
  }.on('willDestroyElement'),

  updatePopupLocation: function() {
    var selectedSvgGroup = this.selectedSvgGroup;
    if (!selectedSvgGroup) { return; }

    var transform = d3.select(selectedSvgGroup).attr('transform'),
        pixeledTransform = transform.replace(',', 'px,').replace(')', 'px)');

    this.$popup.css('transform', pixeledTransform);
  }
});

function createSVG(parentElement) {
  var svg = d3.select(parentElement).append('svg:svg')
      .attr('width', w)
      .attr('height', h);

  // gradient
  var defs = svg.append('svg:defs');

  var backgroundLinearGradient = defs.append('svg:linearGradient').
    attr('id', 'background-linear-gradient').
    attr('x1', '0%').
    attr('y1', '100%').
    attr('x2', '100%').
    attr('y2', '0%');

  backgroundLinearGradient.append('svg:stop').
      attr('offset', '20%').
      attr('stop-color', '#0A4D65').
      attr('stop-opacity', 1);

  backgroundLinearGradient.append('svg:stop').
      attr('offset', '80%').
      attr('stop-color', '#8D470B').
      attr('stop-opacity', 1);

  var backgroundRadialGradient = defs.append('svg:radialGradient').
    attr('id', 'background-radial-gradient').
    attr('cx', '50%').
    attr('cy', '50%').
    attr('r',  '50%').
    attr('fx', '50%').
    attr('fy', '50%');

  backgroundRadialGradient.append('svg:stop').
      attr('offset', '0%').
      attr('stop-color', 'black').
      attr('stop-opacity', 0.8);

  backgroundRadialGradient.append('svg:stop').
      attr('offset', '100%').
      attr('stop-opacity', 0);

  svg.append('svg:rect').
      attr('width', w).
      attr('height', h).
      style('fill', 'url(#background-linear-gradient)');

  svg.append('svg:rect').
      attr('width', w).
      attr('height', h).
      style('fill', 'url(#background-radial-gradient)');
  // \gradient
}

export default Quadrant;
