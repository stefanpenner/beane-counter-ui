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

import groupBy from 'appkit/utils/group_by';

function Region(name, teams) {
  this.name = name;
  this.teams = teams;
}

function League(name, teams) {
  var byRegion = groupBy('region', teams);
  this.regions = [
    new Region('East', byRegion.east),
    new Region('Central', byRegion.central),
    new Region('West', byRegion.west)
  ];
  this.name = name;
}

var StandingsController = Ember.Controller.extend({
  needs: ['application'],
  season: Ember.computed.alias('controllers.application.season'),
  leagues: [
    new League('American League', americanLeagueTeams),
    new League('National League', nationalLeagueTeams)
  ],

  // unique ID assigned by Watcher
  handle: null,

  startWatching: function() {
  }.observes('season').on('init')
});

export default StandingsController;
