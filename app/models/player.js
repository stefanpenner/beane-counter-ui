import players from 'appkit/data/players';

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
  data: players
});

export default Player;
