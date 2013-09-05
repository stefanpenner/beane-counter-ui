import demux from 'appkit/ziggrid/demux';
import PLAYER_SEASON from 'appkit/player_season_to_date_data';

var QuadrantPlayer = Ember.Object.extend({
  hotness: 0,
  goodness: 0,

  watching: Ember.computed.notEmpty('watchHandle'),

  watchHandle: null,

  profile: function() {
    if (this.get('watching')) {
      return this.get('_profile');
    }
  }.property('watching', '_profile'),

  watchProfile: function() {
    // TODO: inject
    var connectionManager = App.__container__.lookup('connection_manager:main');

    var handle = demux.lastId++;
    this.set('watchHandle', handle);

    var self = this;
    demux[handle] = {
      update: function(data) {
        if (!self.get('watching')) { return; }
        self.set('_profile', data);
      }
    };

    var hash = {
      watch: 'Profile',
      unique: handle,
      player: this.get('name')
    };

    // Send the JSON message to the server to begin observing.
    var stringified = JSON.stringify(hash);
    connectionManager.send(stringified);
  },

  unwatchProfile: function() {
    // TODO: inject
    var connectionManager = App.__container__.lookup('connection_manager:main');
    connectionManager.send(JSON.stringify({ unwatch: this.get('watchHandle') }));

    this.set('watchHandle', null);
    this.set('_profile', null);
  }
});

QuadrantPlayer.reopenClass({
  watchPlayers: function(playerNames) {

    // This is required because injections don't make it onto the factory
    var connectionManager = App.__container__.lookup('connection_manager:main');

    var watchedPlayers = [];

    playerNames.forEach(function(playerName, i) {

      var handle = demux.lastId++;
      demux[handle] = {
        update: function(data) {

          var attrs = {};

          if (data.ziggridType === 'snapshot_playerSeasonToDate') {
            attrs.goodness = data.average;
          } else if (data.ziggridType === 'snapshot_clutchnessSeasonToDate') {
            // TODO: use actually values.
            attrs.hotness = Math.random();
          } else {
            console.log("WAT");
          }

          var player = watchedPlayers.findProperty('name', data.player);
          if (player) {

            attrs.hotness = Math.random(); // TODO get rid of this
            player.setProperties(attrs);
          } else {
            attrs = $.extend({ hotness: Math.random(), goodness: Math.random() }, attrs);
            attrs.name = data.player;
            watchedPlayers.pushObject(QuadrantPlayer.create(attrs));
          }
        }
      };

      var hash = {
        watch: 'Snapshot_playerSeasonToDate',
        unique: handle,
        player: playerName,
        season: "2006"
      };

      // Send the JSON message to the server to begin observing.
      var stringified = JSON.stringify(hash);
      connectionManager.send(stringified);

      function fireStubbedData(timeout) {
        var playerData = PLAYER_SEASON[0];
        playerData.deliveryFor = handle;
        playerData.payload.average = Math.random();
        playerData.payload.player = playerName;

        var playerDataString = JSON.stringify(playerData);
        var stubbedPayload = {
          responseBody: playerDataString,
          status: 200
        };
        Ember.run.later(connectionManager, 'handleMessage', stubbedPayload, timeout);
      }
      // Uncomment these to make the graph mooooooove.
      fireStubbedData(500 + i*500);
      //fireStubbedData(1500 + i*500);
      //fireStubbedData(2500 + i*500);
      //fireStubbedData(3500 + i*500);
      //fireStubbedData(5500 + i*500);
      //fireStubbedData(8500 + i*500);
    });

    return watchedPlayers; // TODO: some record array.
  }
});

export default QuadrantPlayer;

