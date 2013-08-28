import Watcher from 'appkit/ziggrid/watcher';

var IndexRoute = Ember.Route.extend({
  model: function() {

    // TODO: move this elsewhere, at least up to ApplicationRoute
    var watcher = new Watcher(App);

    //var dataClass = this.container.lookupFactory('');
    var leaderboard = watcher.watch('Leaderboard_average_groupedBy_season', {"season":"2006"});


    // TODO: more legit promise solution? isLoading never becomes true,
    // probably due to the weird way we load stuff.
    var entries = leaderboard.get('entries');
    entries.then = null;
    return entries;
  }
});

export default IndexRoute;
