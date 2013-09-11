var Player = Ember.Object.extend({
  PlayerName: function(){
    var code = this.get('code');
    var playerData = Player.dataByName[code];
    var name;

    if (playerData) {
      name = playerData.PlayerName;
    }

    return name || this.get('name') || code;
  }.property('code')
});

Player.reopenClass({
  getPlayerData: function(code) {
    throw new Error('implement me');
  },

  nameFromCode: function(code) {
    var player = this.dataByName[code];

    return player && player.PlayerName;
  },

  data: undefined,
  playerCodes: function() {
    return Ember.keys(this.allStars);
  }
});

export default Player;
