import BeanTable from 'appkit/components/bean-table';

var Homeruns = BeanTable.extend({
  type: 'Leaderboard_homeruns_groupedBy_season',
  entryType: 'LeaderboardEntry_homeruns_groupedBy_season',

  headers: ['Home Runs', 'HR']
});

export default Homeruns;

