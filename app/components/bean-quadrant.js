var w = 750,
    h = 500,
    radius = 5;

function playerX(scale){
  return function(player) {
    return scale(Ember.get(player, 'goodness')) + 'px';
  };
}

function playerY(scale){
  return function(player) {
    return scale(Ember.get(player, 'hotness')) + 'px';
  };
}

function get(path) {
  return function(object) {
    return Ember.get(object, path);
  };
}

function fadeOutPlayer(){
  if (d3.select(this).classed('selected')) {
    deselect(component);
  }
}

function appendPlayers(players, component) {
  players.
    append('span').
      classed('name', true).
      text(get('PlayerName'));

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

  if (selectedPlayer === playerData) {
    deselect(component);
  } else {
    component.set('selectedPlayer', playerData);
    selected.classed('selected', true);
  }
}

function deselect(component) {
  component.set('selectedPlayer', null);
  d3.select('.selected').classed('selected', false);
}

var Quadrant = Ember.Component.extend({
  selectedPlayer: null,
  renderGraph: function() {
    var $container = this.$().find('.quadrant-container');
    createSVG($container.get(0));

    this.$popup = this.$().find('.quadrant-popup');
    this.xscale = d3.scale.linear().
      domain([0, 1]).
      range([9.5, w-9.5]).
      clamp(true);

    this.yscale = d3.scale.linear().
      domain([0, 1]).
      range([h-9.5, 9.5]).
      clamp(true);

    this.dataDidChange();

    // TODO: make sure we clean this guy up
    (function syncPopupPosition(){
      var selected = $('.selected');
      var popup = $('.quadrant-popup');

      popup.css({
        left: selected.css('left'),
        top: selected.css('top')
      });

      window.requestAnimationFrame(syncPopupPosition);
    }());

  }.on('didInsertElement'),

  renderD3: function() {
    var season = this.get('season');

    var container = d3.select(this.$('.quadrant-graph')[0]);
    var data = this.get('players').filter(function(player) {
      return player.hasSeason(season);
    }).filterBy('realized');

    var component = this;

    var xscale = this.xscale;
    var yscale = this.yscale;

    var players = container.
      selectAll('.quadrant-player').
      data(data, get('name'));

    players.exit().each(fadeOutPlayer).
      transition().
      duration(300).
      style({
        opacity: 0
      }).remove();

    players.enter().
      append('div').
      attr('data-id', get('name')).
      attr('data-name', get('humanizedName')).
      classed('quadrant-player', true).
      style({
        opacity: 0,
        left: playerX(xscale),
        top: playerY(yscale)
      }).call(function(players) {
        players.
          append('span').
            classed('name', true).
            text(get('humanizedName'));

        players.
          append('div').
          classed('circle', true);

        players.
          on('click', function(d, i) {
            clickPlayer.call(this, d, component);
          });
      });

    players.transition().
      duration(1000).
      ease('linear').
      style({
        opacity: 1,
        left: playerX(xscale),
        top: playerY(yscale)
      });
  },

  dataDidChange: function() {
    Ember.run.throttle(this, 'renderD3', 100);
  }.observes('players.@each.hotness', 'players.@each.goodness', 'season'),

  teardownGraph: function() {
    // TODO: what kind of teardown does d3 need?
  }.on('willDestroyElement'),

  click: function(e) {
    if (e.target.tagName !== 'rect') { return; }
    deselect(this);
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
