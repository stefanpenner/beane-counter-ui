var QuadrantController = Ember.Controller.extend({
  needs: ['filter'],
  filter: Ember.computed.alias('controllers.filter'),

  progress: function() {
    var day = this.get('gameDates.lastObject.day') || 0;
    return Math.min(100, day / 365.0 * 100);
  }.property('gameDates.[]')
});

export default QuadrantController;
