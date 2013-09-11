import indexBy from 'appkit/utils/index_by';
import groupBy from 'appkit/utils/group_by';
import aggregatePlayers from 'appkit/utils/aggregate_players';
import csv from 'appkit/utils/csv';

// Load all the csv data
var initializer = {
  name: 'load-csv',
  initialize: function(container, application) {
    application.deferReadiness();

    Ember.RSVP.hash({
      allStars: csv('all-stars.csv'),
      allTeams: csv('all-teams.csv'),
      allPlayers: csv('all-players.csv')
    }).then(function(hash) {
      application.advanceReadiness();

      var Player = container.lookupFactory('model:player');
      var TeamListing = container.lookupFactory('model:team_listing');

      // TODO: store object would be better
      Player.reopenClass({
        dataByName: indexBy('PlayerCode', hash.allPlayers),
        allStars: aggregatePlayers(hash.allStars)
      });

      TeamListing.reopenClass({
        allTeamsByLeague: groupBy('League', hash.allTeams),
        allTeams: hash.allTeams
      });

    }).fail(Ember.RSVP.rethrow);
  }
};

export default initializer;
