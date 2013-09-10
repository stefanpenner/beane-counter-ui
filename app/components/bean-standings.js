var get = Ember.get;

var Table = Ember.Component.extend({
  title: function() {
    return this.get('region').capitalize();
  }.property('region'),

  headers: function() {
    return [this.get('title'), 'W', 'L'];
  }.property(),

  entries: Ember.computed.filter('teams', function(team) {
    return get(team, 'region') === get(this, 'region');
  })
});

export default Table;

