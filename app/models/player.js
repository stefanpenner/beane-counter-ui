var Player = Ember.Object.extend({
});

Player.reopenClass({
  getPlayerData: function(code) {
    throw new Error('implement me');
  },

  nameFromCode: function(code) {
    return playerNames[code];
  },

  data: undefined,
  playerCodes: function() {
    return Ember.keys(this.allStars);
  }
});

export default Player;
