var QuadrantPlayerController = Ember.ObjectController.extend({

  playerWillChange: function() {
    var oldPlayer = this.get('content');
    if (oldPlayer) {
      oldPlayer.unwatchProfile();
    }
  }.observesBefore('content'),

  playerChanged: function() {
    var newPlayer = this.get('content');
    if (newPlayer) {
      newPlayer.watchProfile();
    }
  }.observes('content')
});

export default QuadrantPlayerController;

