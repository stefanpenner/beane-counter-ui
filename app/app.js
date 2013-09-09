import Resolver from 'resolver';
import Store from 'appkit/store';
import demux from 'appkit/ziggrid/demux';

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

// For our range input in bean-player
Ember.TextField.reopen({
  attributeBindings: ['step']
});

export default App;


