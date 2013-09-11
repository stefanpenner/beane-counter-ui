import Resolver from 'resolver';
import Store from 'appkit/store';
import demux from 'appkit/ziggrid/demux';

// Enable late registration helpers/components
Ember.FEATURES['container-renderables'] = true;

var App = Ember.Application.extend({
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

import watcherInitializer from 'appkit/initializers/watcher';
App.initializer(watcherInitializer);

import csvInitializer from 'appkit/initializers/csv';
App.initializer(csvInitializer);

import routes from 'appkit/routes';

App = App.create();
App.Router.map(routes); // TODO: just resolve the router
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

export default App;
