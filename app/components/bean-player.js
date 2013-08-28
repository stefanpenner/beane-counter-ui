var Player = Ember.Component.extend({

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
