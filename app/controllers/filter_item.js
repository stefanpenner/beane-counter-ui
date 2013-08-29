var FilterItemController = Ember.ObjectController.extend({
  isSelected: function() {
    return this.get('content') === this.get('parentController.selectedFilter');
  }.property('parentController.selectedFilter')
});

export default FilterItemController;
