import Player from 'appkit/models/player';
import QuadrantPlayer from 'appkit/models/quadrant_player';

var season = 2009;

var ApplicationRoute = Ember.Route.extend({
  setupController: function(controller) {

    var watcher = this.container.lookup('watcher:main');
    this.watcher = watcher;

    var winLoss = watcher.watch('WinLoss', 'WinLoss',{"team":"ATL"}); // team ignored?

    var gameDates = watcher.watchGameDate();

    controller.set('season', season);

    this.controllerFor('quadrant').set('gameDates', gameDates);

    this.updateQuadrantPlayers(season);
  },

  updateQuadrantPlayers: function(filter) {

    var filterController = this.controllerFor('filter');
    filterController.set('selectedFilter', filter);

    // TODO: grab this dynamically from leaderboard.

    var quadrantPlayerNames = Player.data.map(function(p) { return p.code; }); //.slice(0, 30);
    var players = QuadrantPlayer.watchPlayers(quadrantPlayerNames, season);
    this.controllerFor('quadrant').set('players', players);
  },

  actions: {
    selectFilter: function(filter) {
      this.updateQuadrantPlayers(filter);
    },
    didBeginPlaying: function() {
      this.watcher.keepSendingGameDates = true;
    },
    didEndPlaying: function() {
      this.watcher.keepSendingGameDates = false;
    }
  }
});

export default ApplicationRoute;
