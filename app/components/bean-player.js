var Player = Ember.Component.extend({
  progress: 0,
  isPlaying: false,
  progressText: null,
  showNub: true,
  _nubProgress: 0,
  nubProgressIsSynced: true,

  generator: Ember.computed.alias('connectionManager.generator'),

  progressTextStyle: function() {
    var nubProgress = this.get('nubProgress') || 0;
    return 'left: ' + (nubProgress * 99 + 0) + '%;';
  }.property('nubProgress'),

  nubProgress: function(key, val) {
    if (arguments.length === 2) {
      // Setter. Gets called when user grabs the nub.
      if (this.get('progress') - val < 0.01) {
        this.set('nubProgressIsSynced', true);
        Ember.run.next(this, 'notifyPropertyChange', 'nubProgress');
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
    return 'width: ' + this.get('progressPercentage') + '%;';
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
