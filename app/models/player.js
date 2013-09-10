import players from 'appkit/data/players';
import playersNames from 'appkit/data/player_names';

var dict = {};
players.forEach(function(player) {
  dict[player.code] = player;
});

var Player = Ember.Object.extend({
});

Player.reopenClass({
  getPlayerData: function(code) {
    return dict[code];
  },
  nameFromCode: function(code){
    return playerNames[code];
  },
  data: players
});

export default Player;
