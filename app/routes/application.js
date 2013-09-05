import QuadrantPlayer from 'appkit/models/quadrant_player';

var ApplicationRoute = Ember.Route.extend({
  setupController: function() {

    var controller = this.controllerFor('application'),
        watcher = this.container.lookup('watcher:main');

    var leaderboard = watcher.watch('Leaderboard_average_groupedBy_season',
                                'LeaderboardEntry_average_groupedBy_season',
                                { "season": "2006" });

    var otherThing = watcher.watch('Leaderboard_average_groupedBy_season',
                                   'LeaderboardEntry_average_groupedBy_season',
                                   { "season": "2006" });

    //watcher.watch('GameDate', 'GameDate');

    var namespace = this.container.lookup('application:main');
    controller.setProperties({
      leaderboard: {
        table: leaderboard.get('table'),
        headers: Ember.keys(namespace[leaderboard.constructor.model.table.name.capitalize()].model)
      },
      otherThing: {
        table: otherThing.get('table'),
        headers: Ember.keys(namespace[otherThing.constructor.model.table.name.capitalize()].model)
      }
    });

    this.updateQuadrantPlayers(2006);
  },

  updateQuadrantPlayers: function(filter) {

    var filterController = this.controllerFor('filter');
    filterController.set('selectedFilter', filter);

    // TODO: grab this dynamically from leaderboard.
    var quadrantPlayers = ["hairj002", "hattj001", "inglj001", "boona001", "willb002", "widgc001", "matsh001", "linda001", "lugoj001", "mauej001"];
    var players = QuadrantPlayer.watchPlayers(quadrantPlayers);
    this.controllerFor('quadrant').set('players', players);
  },

  actions: {
    selectFilter: function(filter) {
      this.updateQuadrantPlayers(filter);
    }
  }
});

export default ApplicationRoute;
