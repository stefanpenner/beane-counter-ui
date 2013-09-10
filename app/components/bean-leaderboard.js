import BeanTable from 'appkit/components/bean-table';

var Leaderboard = BeanTable.extend({

  type: 'Leaderboard_average_groupedBy_season',
  entryType: 'LeaderboardEntry_average_groupedBy_season',

  headers: ['Batting Average', 'AVG']
});

export default Leaderboard;

