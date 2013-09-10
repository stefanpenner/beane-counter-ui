import demux from 'appkit/ziggrid/demux';
import nationalLeagueTeams from 'appkit/data/national_league';
import americanLeagueTeams from 'appkit/data/american_league';

var americanLeague = {
  name: "American League",
  teams: americanLeagueTeams,
  standings: []
};

var nationalLeague = {
  name: "National League",
  teams: nationalLeagueTeams,
  standings: []
};

var StandingsController = Ember.Controller.extend({
  needs: ['application'],
  season: Ember.computed.alias('controllers.application.season'),
  leagues: [ americanLeague, nationalLeague ],

  // unique ID assigned by Watcher
  handle: null,

  startWatching: function() {
    var watcher = App.__container__.lookup('watcher:main'),
        handle = this.get('handle');

    if (handle) {
      watcher.unwatch(handle);
    }

    //var winLoss = watcher.watch('WinLoss', 'WinLoss',{"team":"ATL"}); // team ignored?
    var winLoss = watcher.watch('WinLoss', 'WinLoss', {}, function(data) {

      // TODO: more efficient to use computed dictionary here.
      var league = americanLeague.teams.findProperty('code', data.team) ?
                   americanLeague : nationalLeague;

      var standing = league.standings.findProperty('team', data.team);
      if (standing) {
        Ember.setProperties(standing, data);
      } else {
        league.standings.pushObject(data);
      }
    });

    // this is kinda hacky/brittle; this is updated in watcher.watch()
    this.set('handle', demux.lastId);
  }.observes('season').on('init')
});

export default StandingsController;
