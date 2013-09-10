import Resolver from 'resolver';
import Store from 'appkit/store';
import demux from 'appkit/ziggrid/demux';

// Enable late registration helpers/components
Ember.FEATURES['container-renderables'] = true;

var App = Ember.Application.create({
  modulePrefix: 'appkit', // TODO: loaded via config
  Store: Store,
  Resolver: Resolver,
  gameDateRanges: {
    '2006': [92, 274],
    '2007': [91, 274],
    '2008': [85, 274],
    '2009': [95, 279],
    '2010': [94, 276],
    '2011': [90, 271],
    '2012': [88, 277]
  }
});

import routes from 'appkit/routes';
App.Router.map(routes); // TODO: just resolve the router

// TODO: move this elsewhere, at least up to ApplicationRoute
import Watcher from 'appkit/ziggrid/watcher';
var watcher = new Watcher(App);
App.register('watcher:main', watcher, { instantiate: false });

App.deferReadiness(); // defering to allow sync boot with Ziggrid



var url = 'http://couchconf.ziggrid.org:8088/ziggrid/';

import ConnectionManager from 'appkit/ziggrid/connection_manager';
var connectionManager = ConnectionManager.create({
  url: url,
  namespace: App
});

App.register('connection_manager:main', connectionManager, {
  instantiate: false
});

App.inject('component:bean-player',
           'connectionManager',
           'connection_manager:main');

Ember.Handlebars.registerBoundHelper('round', function(val) {
  if (!isNaN(val) && !/^\d+$/.test(val)) {
    return val.toFixed(3);
  } else {
    return (val || val === 0) ? val : 'N/A';
  }
});

import Player from 'appkit/models/player';

App.register('helper:nameFromCode', Ember.Handlebars.makeBoundHelper(function(code) {
  return Player.nameFromCode(code) || code;
}));

// TODO: happier way to do this automatically?
// This way is bad because the component subclasses don't
// get their injections...
import BeanProduct from 'appkit/components/bean-production';
import BeanLeaderboard from 'appkit/components/bean-leaderboard';
import BeanHomeruns from 'appkit/components/bean-homeruns';
Ember.Handlebars.helper('bean-production', BeanProduct);
Ember.Handlebars.helper('bean-leaderboard', BeanLeaderboard);
Ember.Handlebars.helper('bean-homeruns', BeanHomeruns);

// For our range input in bean-player
Ember.TextField.reopen({
  attributeBindings: ['step']
});

import csv from 'appkit/utils/csv';

App.deferReadiness();


function indexBy(property, collection) {
  var index = {};

  collection.forEach(function(entry) {
    index[Ember.get(entry, property)] = entry;
  });

  return index;
}

function aggregatePlayers(players) {

  var result = { };

  players.forEach(function(entry) {
    var code = entry.PlayerCode;
    var player = result[code] = result[code] || {
      name: entry.PlayerName,
      code: code,
      seasons: {}
    };

    player.seasons[entry.Year] = entry;
  });

  return result;
}

Ember.RSVP.hash({
  allStars: csv('all-stars.csv'),
  allTeams: csv('all-teams.csv'),
  allPlayers: csv('all-players.csv')
}).then(function(hash) {
  App.advanceReadiness();

  var Player = App.__container__.lookupFactory('model:player');

  Player.reopenClass({
    dataByName: indexBy('PlayerCode', hash.allPlayers),
    allStars: aggregatePlayers(hash.allStars)
  });

}, Ember.RSVP.rethrow);

export default App;
