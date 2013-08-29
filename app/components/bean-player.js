var Player = Ember.Component.extend({

  generator: Ember.computed.alias('connectionManager.generator'),

  isPlaying: false,

  play: function() {
    this.set('isPlaying', true);
  },

  pause: function() {
    this.set('isPlaying', false);
  },

  progressChanged: function() {

    var oldProgress = this.get('progress');

    // TODO: things
  }.observes('progress'),

  count: 12345

});

export default Player;
