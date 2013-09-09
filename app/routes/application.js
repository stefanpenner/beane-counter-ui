import QuadrantPlayer from 'appkit/models/quadrant_player';
import Player from 'appkit/models/player';

var ApplicationRoute = Ember.Route.extend({
  setupController: function() {

    var controller = this.controllerFor('application'),
        watcher = this.container.lookup('watcher:main');
    this.watcher = watcher;

    var season = 2006;

    var leaderboard = watcher.watch('Leaderboard_average_groupedBy_season',
                                    'LeaderboardEntry_average_groupedBy_season',
                                    { season: season });

    var production = watcher.watch('Leaderboard_production_groupedBy_season',
                                   'LeaderboardEntry_production_groupedBy_season',
                                   { season: season });

    var homeruns = watcher.watch('Leaderboard_homeruns_groupedBy_season',
                                 'LeaderboardEntry_homeruns_groupedBy_season',
                                 { season: season });

    var winLoss = watcher.watch('WinLoss', 'WinLoss',{"team":"ATL"}); // team ignored?

    var gameDates = watcher.watchGameDate();

    var namespace = this.container.lookup('application:main');
    controller.setProperties({
      leaderboard: {
        table: leaderboard.get('table'),
        headers: Ember.keys(namespace[leaderboard.constructor.model.table.name.capitalize()].model)
      },
      production: {
        table: production.get('table'),
        headers: Ember.keys(namespace[production.constructor.model.table.name.capitalize()].model)
      },
      homeruns: {
        table: homeruns.get('table'),
        headers: Ember.keys(namespace[homeruns.constructor.model.table.name.capitalize()].model)
      }
    });

    this.controllerFor('quadrant').set('gameDates', gameDates);

    this.updateQuadrantPlayers(2006);
  },

  updateQuadrantPlayers: function(filter) {

    var filterController = this.controllerFor('filter');
    filterController.set('selectedFilter', filter);

    // TODO: grab this dynamically from leaderboard.

    var quadrantPlayerNames = Player.data.map(function(p) { return p.name; }); //.slice(0, 30);
    var players = QuadrantPlayer.watchPlayers(quadrantPlayerNames, 2006);
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
