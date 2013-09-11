import BeanTable from 'appkit/components/bean-table';

var Production = BeanTable.extend({
  type: 'Leaderboard_production_groupedBy_season',
  entryType: 'LeaderboardEntry_production_groupedBy_season',

  headers: ['Production', 'PR']
});

export default Production;

