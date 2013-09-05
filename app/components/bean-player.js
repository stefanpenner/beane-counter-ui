var Player = Ember.Component.extend({

  progress: 0,

  generator: Ember.computed.alias('connectionManager.generator'),

  isPlaying: false,

  progressChanged: function() {

    var oldProgress = this.get('progress');

    // TODO: things
  }.observes('progress'),

  nubProgressIsSynced: true,

  _nubProgress: 0,
  nubProgress: function(key, val) {
    if (arguments.length === 2) {
      // Setter. Gets called when user grabs the nub.
      if (this.get('progress') - val < 3) {
        this.set('nubProgressIsSynced', true);
      } else {
        this.set('nubProgressIsSynced', false);
        this.set('_nubProgress', val);
      }
    } else {
      // Getter
      if (this.get('nubProgressIsSynced')) {
        return this.get('progress');
      } else {
        return this.get('_nubProgress');
      }
    }
  }.property('progress', 'nubProgressIsSynced'),

  count: 12345,

  progressBarStyle: function() {
    return "width: " + this.get('progress') + "%;";
  }.property('progress'),

  actions: {
    play: function() {
      if (this.get('isPlaying')) { return; }
      this.get('generator').start();
      this.set('isPlaying', true);
      this.sendAction('didBeginPlaying');
    },

    pause: function() {
      if (!this.get('isPlaying')) { return; }
      this.get('generator').stop();
      this.set('isPlaying', false);
      this.sendAction('didEndPlaying');
    }
  }
});

export default Player;
