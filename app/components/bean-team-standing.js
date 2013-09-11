var TeamStanding = Ember.Component.extend({
  team: null,
  watcher: Ember.computed(function() {
    return this.container.lookup('watcher:main');
  }),
  winLoss: function() {
    var watcher = this.get('watcher');

    // TODO: unwatch (although this demo wont need it)
    return watcher.watch('WinLoss', 'WinLoss', {
      team: this.get('team.code')
    });
  }.property(),
  wins: Ember.computed.alias('winLoss.wins'),
  losses: Ember.computed.alias('winLoss.losses')
});

export default TeamStanding;
