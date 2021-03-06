import demux from 'appkit/ziggrid/demux';
import Player from 'appkit/models/player';
import flags from 'appkit/flags';

var App = window.App;

var QuadrantPlayer = Ember.Object.extend({
  init: function(){
    this._super();
    QuadrantPlayer.all.pushObject(this);
    QuadrantPlayer.allByCode[this.get('code')] = this;
  },

  code: Ember.computed.alias('data.code'),

  realized: false,
  hotness: 0,
  goodness: 0,
  watchHandle: null,
  imageUrl: function(){
    return '/players/' + this.get('code') + '.png';
  }.property('data.name').readOnly(),
  watching: Ember.computed.bool('watchHandle'),

  // the actual player data resides on the Player mode,
  // this merely decorates. It is possible for us to have
  // inconsitent data, has this extra abstractoin
  data: function() {
    var name = this.get('name');
    var data = Player.allStars[name] || {};
    var playerData = Player.dataByName[name] || {};
    Ember.merge(data, playerData);
    return data;
  }.property('name'),

  hasSeason: function(season) {
    var seasons = this.get('data.seasons');

    return !!(seasons && seasons[season]);
  },

  humanizedName: Ember.computed.oneWay('data.PlayerName'),

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
  all: [],
  allByCode: {},
  findOrCreateByName: function(playerName) {
    var player = QuadrantPlayer.all.findProperty('name', playerName);

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

    return QuadrantPlayer.all; // TODO: some record array.
  }
});

function updateQuadrantPlayer(data) {
  if (flags.LOG_WEBSOCKETS) {
    console.log('updateQuadrantPlayer', data);
  }

  var attrs = {
    realized: true
  };

  var player = QuadrantPlayer.allByCode[data.player];

  if (data.average) {
    attrs.goodness = normalizedQuadrantValue(player, 'hotness', data.average);
  }

  if (data.correlation) {
    attrs.hotness = normalizedQuadrantValue(player, 'goodness', data.correlation);
  }

  if (player) {
    player.setProperties(attrs);
  } else {
    attrs.name = data.player;
    QuadrantPlayer.create(attrs);
  }
}

function normalizedQuadrantValue(player, key, value) {
  if (isValidQuadrantValue(value)) {
    return value;
  } else {
    return (player && Ember.get(player, key)) || Math.random();
  }
}

function isValidQuadrantValue(value) {
  return value && value >= 0 && value <= 1;
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
