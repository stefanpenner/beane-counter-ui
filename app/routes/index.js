var IndexRoute = Ember.Route.extend({
  setupController: function() {
    var controller = this.controllerFor('index'),
        watcher = this.container.lookup('watcher:main');

    var leaderboard = watcher.watch('Leaderboard_average_groupedBy_season',
                                'LeaderboardEntry_average_groupedBy_season',
                                { "season": "2006" });

    var otherThing = watcher.watch('Leaderboard_average_groupedBy_season',
                                   'LeaderboardEntry_average_groupedBy_season',
                                   { "season": "2006" });

    controller.setProperties({
      leaderboard: leaderboard.get('entries'),
      otherThing: otherThing.get('entries')
    });
  }
});

export default IndexRoute;
