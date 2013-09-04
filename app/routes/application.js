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


    // TODO: grab this dynamically from leaderboard.
    var quadrantPlayers = ["hairj002", "hattj001", "inglj001", "boona001", "willb002", "widgc001", "matsh001", "linda001", "lugoj001", "mauej001"];


    watcher.watch('GameDate', 'GameDate');

    var watchedQuadrantPlayers = quadrantPlayers.map(function(name) {
      watcher.watch('Snapshot_clutchnessSeasonToDate',
                           'Snapshot_clutchnessSeasonToDate',
                           { player: name, season: "2006" });
      return watcher.watch('Snapshot_playerSeasonToDate',
                           'Snapshot_playerSeasonToDate',
                           { player: name, season: "2006" });
    });
    //Snapshot_playerSeasonToDate

    //var profile = watcher.watch('Profile', 'Profile', {player:'mccab002'});

    //var model = this.container.lookup('application:main')[leaderboard.constructor.model.table.name.capitalize()].model;
    var namespace = this.container.lookup('application:main');
    controller.setProperties({
      leaderboard: {
        table: leaderboard.get('table'),
        headers: Ember.keys(namespace[leaderboard.constructor.model.table.name.capitalize()].model)
      },
      otherThing: {
        table: otherThing.get('table'),
        headers: Ember.keys(namespace[otherThing.constructor.model.table.name.capitalize()].model)
      },
      watchedQuadrantPlayers: watchedQuadrantPlayers
    });

    this.updateQuadrantPlayers(2006);
  },

  updateQuadrantPlayers: function(filter) {

    var filterController = this.controllerFor('filter');
    filterController.set('selectedFilter', filter);

    var players = [];
    for(var i = 0, len = 10; i < len; ++i) {
      players.push({
        name: "PlayerName" + (i+1),
        hotness: Math.random(),
        goodness: Math.random()
      });
    }

    this.controllerFor('quadrant').set('players', players);
  },

  actions: {
    selectFilter: function(filter) {
      this.updateQuadrantPlayers(filter);
    }
  }
});

export default ApplicationRoute;
