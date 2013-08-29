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
  }
});

export default ApplicationRoute;
