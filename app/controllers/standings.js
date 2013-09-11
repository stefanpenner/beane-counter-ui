import demux from 'appkit/ziggrid/demux';
import groupBy from 'appkit/utils/group_by';

function Region(name, teams) {
  this.name = name;
  this.teams = teams;
}

function League(name, teams) {
  var grouped = groupBy('Division', teams);
  this.regions = [
    new Region('East',    grouped.East),
    new Region('Central', grouped.Central),
    new Region('West',    grouped.West)
  ];

  this.name = name;
}

var StandingsController = Ember.Controller.extend({
  needs: ['application'],
  season: Ember.computed.alias('controllers.application.season'),
  leagues: Ember.computed(function(){
    var TeamListing = this.container.lookupFactory('model:team_listing');
    var byLeague = TeamListing.allTeamsByLeague;

    return [
      new League('American League', byLeague.AL),
      new League('National League', byLeague.NL)
    ];
  }),
  // unique ID assigned by Watcher
  handle: null,

  startWatching: function() {
  }.observes('season').on('init')
});

export default StandingsController;
