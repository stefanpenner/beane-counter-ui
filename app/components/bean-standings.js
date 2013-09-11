var get = Ember.get;

var Table = Ember.Component.extend({

  // Template args
  league: null,
  region: null,

  title: Ember.computed.alias('region.name'),

  headers: function() {
    return [this.get('title'), 'W', 'L'];
  }.property()
});

export default Table;

