import { percentageOfData } from 'appkit/utils/percentage_of_data';

var QuadrantController = Ember.Controller.extend({
  needs: ['filter'],
  filter: Ember.computed.alias('controllers.filter.selectedFilter'),

  progress: function() {
    var gameDate = this.get('gameDates.lastObject');

    if (!gameDate) {
      return 0;
    }

    return percentageOfData(gameDate.day, gameDate.season);
  }.property('gameDates.[]'),

  currentDateText: "September 12, 2012"
});

export default QuadrantController;
