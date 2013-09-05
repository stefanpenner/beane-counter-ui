var w = 750,
    h = 500,
    radius = 5,
    get = Ember.get;

function playerKey(player) {
  return get(player, 'name');
}

function appendPlayers(players, component) {
  players.
    append('span').
      classed('name', true).
      text(function(player) { return player.name; });

  players.
    append('div').
    classed('circle', true);

  players.
    on('click', function(d, i) {
      clickPlayer.call(this, d, component);
  });
}

function clickPlayer(playerData, component) {
  d3.select('.selected').classed('selected', false);
  var selectedPlayer = component.get('selectedPlayer');

  var selected = d3.select(this);

  if (selectedPlayer == playerData) {
    component.set('selectedPlayer', null);
    selected.classed('selected', false);
  } else {
    component.set('selectedPlayer', playerData);
    selected.classed('selected', true);
  }

  component.updatePopupLocation();
}

var Quadrant = Ember.Component.extend({
  selectedPlayer: null,
  renderGraph: function() {
    var $container = this.$().find('.quadrant-container');
    createSVG($container.get(0));

    this.$popup = this.$().find('.quadrant-popup');
    this.xscale = d3.scale.linear().
      domain([0, 1]).
      range([9.5, w-9.5]);

    this.yscale = d3.scale.linear().
      domain([0, 1]).
      range([h-9.5, 9.5]);

    this.dataDidChange();
  }.on('didInsertElement'),

  renderD3: function() {
    var container = d3.select(this.$('.quadrant-graph')[0]);
    var data = this.get('players');
    var component = this;

    var xscale = this.xscale;
    var yscale = this.yscale;

    var players = container.
      selectAll('.quadrant-player').
      data(data, function(player, index) {
        return player.name;
    });

    players.exit().remove();
    players.enter().
      append('div').
      classed('quadrant-player', true).
      style({
        left: xscale(0.5) + 'px',
        top: yscale(0.5) + 'px'
      }).
      call(appendPlayers, component);

    players.transition().
      duration(1000).
      ease('linear').
      attr('data-id', function(d) { return d.name; }).
      style({
        left: function(player) { return xscale(player.goodness) + 'px'; },
        top: function(player) { return yscale(player.hotness) + 'px'; }
      });

    this.updatePopupLocation(true);
  },

  dataDidChange: function() {
    Ember.run.scheduleOnce('afterRender', this, 'renderD3');
  }.observes('players.@each.hotness', 'players.@each.goodness'),

  teardownGraph: function() {
    // TODO: what kind of teardown does d3 need?
  }.on('willDestroyElement'),

  updatePopupLocation: function(animate) {
    var player = this.get('selectedPlayer');
    if (!player) { return; }

    var popup = d3.selectAll('.quadrant-popup');

    if (animate) {
      popup = popup.transition().duration(1000).ease('linear');
    }

    popup.
      style({
        left: this.xscale(player.goodness) + 'px',
        top: this.yscale(player.hotness) + 'px'
      });
  },

  click: function(e) {
    // hacks?
    if (e.target.tagName === 'rect') {
      alert('deselect');
    }
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
  //
  svg.append('line').
    attr('stroke-dasharray', '2 2').
    attr('stroke-width', 0.3).
    attr('stroke', 'rgba(255, 255, 255, 0.52)').
    attr('x1', w/2).
    attr('y1', 0).
    attr('x2', w/2).
    attr('y2', h);

  svg.append('line').
    attr('stroke-dasharray', '2 2').
    attr('stroke-width', 0.3).
    attr('stroke', 'rgba(255, 255, 255, 0.52)').
    attr('y1', h/2).
    attr('x1', 0).
    attr('y2', h/2).
    attr('x2', w);
}

export default Quadrant;
