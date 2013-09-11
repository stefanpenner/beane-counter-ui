import indexBy from 'appkit/utils/index_by';
import aggregatePlayers from 'appkit/utils/aggregate_players';
import csv from 'appkit/utils/csv';

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

      Player.reopenClass({
        dataByName: indexBy('PlayerCode', hash.allPlayers),
        allStars: aggregatePlayers(hash.allStars)
      });

    }).fail(Ember.RSVP.rethrow);
  }
};

export default initializer;
