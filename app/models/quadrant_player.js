var QuadrantPlayer = Ember.Object.extend({

  hotness: function() {
    return 0.5;
  }.property(),

  goodness: function() {
    return 0.5;
  }.property()

});

export default QuadrantPlayer;

