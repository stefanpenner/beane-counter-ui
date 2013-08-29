var FilterController = Ember.Controller.extend({
  needs: ['application'],

  years: Ember.computed.alias('controllers.application.years'),

  selectedFilter: null
});

export default FilterController;
