var Player = Ember.Component.extend({

  generator: Ember.computed.alias('connectionManager.generator'),

  isPlaying: false,

  progressChanged: function() {

    var oldProgress = this.get('progress');

    // TODO: things
  }.observes('progress'),

  count: 12345,

  actions: {
    play: function() {
      if (this.get('isPlaying')) { return; }
      this.get('generator').start();
      this.set('isPlaying', true);
    },

    pause: function() {
      if (!this.get('isPlaying')) { return; }
      this.get('generator').stop();
      this.set('isPlaying', false);
    }
  }
});

export default Player;
