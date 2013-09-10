var get = Ember.get;

var Table = Ember.Component.extend({
  title: function() {
    return this.get('region').capitalize();
  }.property('region'),

  headers: function() {
    return [this.get('title'), 'W', 'L'];
  }.property(),

  entries: Ember.computed.filter('standings', function(team) {
    // TODO: filter this by region
    return true;
  })
});

export default Table;

