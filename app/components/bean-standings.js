import nationalLeagueTeams from 'appkit/data/national_league';
import americanLeagueTeams from 'appkit/data/american_league';

var get = Ember.get;

var Table = Ember.Component.extend({

  // Template args
  league: null,
  region: null,

  title: function() {
    return this.get('region').capitalize();
  }.property('region'),

  headers: function() {
    return [this.get('title'), 'W', 'L'];
  }.property(),

  standings: Ember.computed.alias('league.standings'),

  entries: Ember.computed.filter('standings', function(standing) {
    // TODO: filter this by region
    var leagueTeams = this.get('league.teams'),
        leagueTeam = leagueTeams.findProperty('code', standing.team);

    return leagueTeam && leagueTeam.region === this.get('region');
  })
});

export default Table;

