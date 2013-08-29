var IndexRoute = Ember.Route.extend({
  model: function() {
    var watcher = this.container.lookup('watcher:main');
    var leaderboard = watcher.watch('Leaderboard_average_groupedBy_season',
                                    'LeaderboardEntry_average_groupedBy_season', {
      "season": "2006"
    });

    // TODO: more legit promise solution? isLoading never becomes true,
    // probably due to the weird way we load stuff.
    var entries = leaderboard.get('entries');
    entries.then = null;

    return entries;
  }
});

export default IndexRoute;
