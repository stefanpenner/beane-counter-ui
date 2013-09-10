import demux from 'appkit/ziggrid/demux';
import PLAYER_SEASON from 'appkit/player_season_to_date_data';
import Player from 'appkit/models/player';

var watchedPlayers = [];
var App = window.App;

var QuadrantPlayer = Ember.Object.extend({
  init: function(){
    this._super();

    watchedPlayers.pushObject(this);
  },
  realized: false,
  hotness: 0,
  goodness: 0,
  watchHandle: null,
  imageUrl: function(){

  }.property(),
  watching: Ember.computed.bool('watchHandle'),

  data: function() {
    return Player.getPlayerData(this.get('name'));
  }.property('name'),

  watchProfile: function() {
    // TODO: inject ziggrid:connection-manager
    var connectionManager = getConnectionManager();

    var handle = ++demux.lastId;

    this.set('watchHandle', handle);
    this.set('profile', null);

    var player = this;

    demux[handle] = {
      update: function(data) {
        player.set('profile', data);
      }
    };

    var query = {
      watch: 'Profile',
      unique: handle,
      player: this.get('name')
    };

    // Send the JSON message to the server to begin observing.
    var stringified = JSON.stringify(query);
    connectionManager.send(stringified);
  },

  unwatchProfile: function() {
    // TODO: inject ziggrid:connection-manager
    var connectionManager = getConnectionManager();
    var watchHandle = this.get('watchHandle');

    if (!watchHandle) {
      throw new Error('No handle to unwatch');
    }

    connectionManager.send(JSON.stringify({
      unwatch: watchHandle
    }));

    this.set('watchHandle', null); // clear handle
  }
});

QuadrantPlayer.reopenClass({
  findOrCreateByName: function(playerName) {
    var player = watchedPlayers.findProperty('name', playerName);

    if (!player) {
      player = QuadrantPlayer.create({
        name: playerName
      });
    }

    return player;
  },
  watchPlayers: function(playerNames, season, dayOfYear) {

    playerNames.forEach(function(playerName, i) {
      watchAttribute('Snapshot_playerSeasonToDate',
                     playerName,
                     season,
                     dayOfYear);

      watchAttribute('Snapshot_clutchnessSeasonToDate',
                     playerName,
                     season,
                     dayOfYear);


      QuadrantPlayer.findOrCreateByName(playerName);
    });

    return watchedPlayers; // TODO: some record array.
  }
});

function updateQuadrantPlayer(data) {
  console.log('updateQuadrantPlayer', data);
  var attrs = {
    realized: true
  };

  if (data.average) {
    attrs.goodness = data.average;
  }

  if (data.correlation) {
    attrs.hotness = data.correlation;
  }

  var player = watchedPlayers.findProperty('name', data.player);

  if (player) {
    player.setProperties(attrs);
  } else {
    attrs.name = data.player;
    watchedPlayers.pushObject(QuadrantPlayer.create(attrs));
  }
}

function fireStubbedData(handle, playerName, timeout) {
  var playerData = PLAYER_SEASON[0];

  playerData.deliveryFor = handle;
  playerData.payload.average = Math.random();
  playerData.payload.player = playerName;

  var playerDataString = JSON.stringify(playerData);
  var stubbedPayload = {
    responseBody: playerDataString,
    status: 200
  };

  Ember.run.later(getConnectionManager(),
                  'handleMessage',
                  stubbedPayload,
                  timeout);
}

function watchAttribute(type, playerName, season, dayOfYear) {

  var handle = ++demux.lastId;
  demux[handle] = {
    update: updateQuadrantPlayer
  };

  var hash = {
    watch: type,
    unique: handle,
    player: playerName//,
    //season: season
  };

  if (dayOfYear) {
    hash.dayOfYear = dayOfYear;
  }

  // Send the JSON message to the server to begin observing.
  var stringified = JSON.stringify(hash);
  getConnectionManager().send(stringified);

  // fireStubbedData(handle, playerName, 500 + i*500);
}

// TODO: inject
function getConnectionManager() {
  return App.__container__.lookup('connection_manager:main');
}

export default QuadrantPlayer;
