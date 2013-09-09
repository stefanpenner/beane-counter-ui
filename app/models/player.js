import players from 'appkit/data/players';

var dict = {};
players.forEach(function(p) {
  dict[p.code] = p;
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
