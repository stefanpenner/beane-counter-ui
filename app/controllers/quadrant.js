var QuadrantController = Ember.Controller.extend({
  needs: ['filter'],
  filter: Ember.computed.alias('controllers.filter.selectedFilter'),

  progress: function() {
    var NUM_GAME_DAYS = 180;
    var day = this.get('gameDates.lastObject.day') || 0;
    return Math.min(100, day / NUM_GAME_DAYS * 100);
  }.property('gameDates.[]')
});

export default QuadrantController;
