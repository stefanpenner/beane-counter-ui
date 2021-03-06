import demux from 'appkit/ziggrid/demux';

var PlayerProfile = Ember.Component.extend({
  player: null,
  init: function () {
    this.connectionManager = this.container.lookup('connection_manager:main'); // inject
    this._super();
  },
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
    this.set('imageFailedToLoad', false);
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
    this.connectionManager.send(stringified);
  },

  unwatchProfile: function() {
    var watchHandle = this.get('watchHandle');

    if (!watchHandle) {
      throw new Error('No handle to unwatch');
    }

    this.connectionManager.send(JSON.stringify({
      unwatch: watchHandle
    }));

    this.set('watchHandle', null); // clear handle
  },

  // TODO: combine the various player car
  imageFailedToLoad: false,
  imageUrl: function() {

    if (this.get('imageFailedToLoad')) {
      return '/players/404.png';
    }

    var code = this.get('player.code');
    if (!code) { return; }
    return '/players/' + code + '.png';
  }.property('player.code', 'imageFailedToLoad').readOnly(),

  listenForImageLoadingErrors: function() {
    var component = this;

    this.$('img').error(function() {
      Ember.run(component, 'set', 'imageFailedToLoad', true);
    });
  }.on('didInsertElement')
});

export default PlayerProfile;
