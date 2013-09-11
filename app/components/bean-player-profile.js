import demux from 'appkit/ziggrid/demux';

var PlayerProfile = Ember.Component.extend({

  player: null,

  players: function() {
    var Player = this.container.lookupFactory('model:player');
    var allStars = Ember.get(Player, 'allStars');

    // just build for real Players the first time
    // this list doesn't change so we don't care
    // also the CP caches.
    return Ember.keys(allStars).map(function(entry) {
      return allStars[entry];
    }).map(function(entry) {
      return Player.create(entry);
    });
  }.property(),

  playerWillChange: function() {
    var oldPlayer = this.get('player');
    if (oldPlayer) {
      this.unwatchProfile();
    }
  }.observesBefore('player'),

  playerChanged: function() {
    var newPlayer = this.get('player');
    if (newPlayer) {
      this.watchProfile();
    }
  }.observes('player').on('init'),

  watchHandle: null,
  profile: null,

  watchProfile: function() {

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
      player: this.get('player.code')
    };

    // Send the JSON message to the server to begin observing.
    var stringified = JSON.stringify(query);
    getConnectionManager().send(stringified);
  },

  unwatchProfile: function() {

    var watchHandle = this.get('watchHandle');

    if (!watchHandle) {
      throw new Error('No handle to unwatch');
    }

    getConnectionManager().send(JSON.stringify({
      unwatch: watchHandle
    }));

    this.set('watchHandle', null); // clear handle
  },

  // TODO: combine the various player car
  imageUrl: function() {
    var code = this.get('player.code');
    if (!code) { return; }
    return '/players/' + code + '.png';
  }.property('player.code').readOnly()
});

// TODO: inject
function getConnectionManager() {
  return App.__container__.lookup('connection_manager:main');
}

export default PlayerProfile;
