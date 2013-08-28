var IndexRoute = Ember.Route.extend({
  model: function() {
    // TODO: more legit promise solution? isLoading never becomes true,
    // probably due to the weird way we load stuff.
    App.leaderboardEntries.then = null;
    return App.leaderboardEntries;
  }
});

export default IndexRoute;
