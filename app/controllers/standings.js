
import nationalLeagueTeams from 'appkit/data/national_league';
import americanLeagueTeams from 'appkit/data/american_league';

var StandingsController = Ember.Controller.extend({
  needs: ['application'],
  season: Ember.computed.alias('controllers.application.season'),
  leagues: [
    {
      name: "American League",
      teams: americanLeagueTeams
    },
    {
      name: "National League",
      teams: nationalLeagueTeams
    }
  ]
});

export default StandingsController;
