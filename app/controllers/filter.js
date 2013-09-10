var FilterController = Ember.Controller.extend({
  needs: ['application'],

  years: Ember.computed.sort('controllers.application.years', function(a, b){
    return (a > b) ? -1 : 1;
  }),

  selectedFilter: null
});

export default FilterController;
