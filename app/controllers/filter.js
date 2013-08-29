var FilterController = Ember.Controller.extend({
  needs: ['application'],

  years: Ember.computed.alias('controllers.application.years'),

  selectedFilter: 2006,

  actions: {
    selectFilter: function(filter) {
      this.set('selectedFilter', filter);
    }
  }
});

export default FilterController;
