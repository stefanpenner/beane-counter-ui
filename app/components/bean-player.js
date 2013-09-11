var Player = Ember.Component.extend({

  progress: 0,
  progressText: null,

  generator: Ember.computed.alias('connectionManager.generator'),

  isPlaying: false,

  nubProgressIsSynced: true,

  progressTextStyle: function() {
    var nubProgress = this.get('nubProgress') || 0;
    console.log(nubProgress);
    return "left: " + nubProgress + "px;";
  }.property('nubProgress'),

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

  progressPercentage: function() {
    return this.get('progress') * 100;
  }.property('progress'),

  progressBarStyle: function() {
    return "width: " + this.get('progressPercentage') + "%;";
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
