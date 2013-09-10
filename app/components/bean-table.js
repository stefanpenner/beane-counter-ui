import demux from 'appkit/ziggrid/demux';

var Table = Ember.Component.extend({

  // e.g. 'Leaderboard_production_groupedBy_season'
  type: null,

  // e.g. 'LeaderboardEntry_production_groupedBy_season'
  entryType: null,

  // unique ID assigned by Watcher
  handle: null,

  // Have to specify this so that subclasses get it too.
  templateName: 'components/bean-table',

  season: null,

  headers: null,

  entries: function() {
    // TODO: more efficient way to display just the first N elements?
    return this.get('content').slice(0, 5);
  }.property('content.[]'),

  content: [],

  startWatching: function() {
    var watcher = this.container.lookup('watcher:main'),
        handle = this.get('handle');

    if (handle) {
      watcher.unwatch(handle);
    }

    var model = watcher.watch(this.get('type'),
                              this.get('entryType'),
                              { season: this.get('season') });

    this.set('content', model.get('table'));

    // this is kinda hacky/brittle; this is updated in watcher.watch()
    this.set('handle', demux.lastId);
  }.observes('season').on('didInsertElement')
});

export default Table;

