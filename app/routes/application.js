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



    //var model = this.container.lookup('application:main')[leaderboard.constructor.model.entries.name.capitalize()].model;
    var namespace = this.container.lookup('application:main');
    controller.setProperties({
      leaderboard: {
        entries: leaderboard.get('entries'),
        headers: Ember.keys(namespace[leaderboard.constructor.model.entries.name.capitalize()].model)
      },
      otherThing: {
        entries: otherThing.get('entries'),
        headers: Ember.keys(namespace[otherThing.constructor.model.entries.name.capitalize()].model)
      }
    });

    this.updateQuadrantPlayers(2006);
  },

  updateQuadrantPlayers: function(filter) {

    var filterController = this.controllerFor('filter');
    filterController.set('selectedFilter', filter);

    var players = [];
    for(var i = 0, len = 10; i < len; ++i) {
      players.push({
        name: "Borf McGee",
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
