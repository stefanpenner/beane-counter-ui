import { percentageOfData } from 'appkit/utils/percentage_of_data';

var get = Ember.get;

var QuadrantController = Ember.Controller.extend({
  needs: ['filter', 'application'],
  filter: Ember.computed.alias('controllers.filter.selectedFilter'),
  showing: Ember.computed.bool('controllers.application.currentPage'),

  progress: function() {
    var gameDate = this.get('currentDate');

    if (!gameDate) {
      return 0;
    }

    return percentageOfData(gameDate.day, parseInt(gameDate.season, 10));
  }.property('currentDate'),

  currentDate: Ember.computed.alias('gameDates.lastObject'),
  //currentDate: { season: '2009', day: '180' },

  currentDateText: function() {
    var date = this.get('currentDate');
    if (!date) { return; }

    var season = get(date, 'season');
    return moment('' + season).day(parseInt(get(date, 'day'), 10) + 1).format('MMMM D, YYYY');
  }.property('currentDate')
});

export default QuadrantController;
