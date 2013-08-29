import Resolver from 'resolver';
import Store from 'appkit/store';
import demux from 'appkit/ziggrid/demux';

var App = Ember.Application.create({
  modulePrefix: 'appkit', // TODO: loaded via config
  Store: Store,
  Resolver: Resolver
});

import routes from 'appkit/routes';
App.Router.map(routes); // TODO: just resolve the router

// TODO: move this elsewhere, at least up to ApplicationRoute
import Watcher from 'appkit/ziggrid/watcher';
var watcher = new Watcher(App);
App.register('watcher:main', watcher, { instantiate: false});

App.deferReadiness(); // defering to allow sync boot with Ziggrid

var url = "http://couchconf.ziggrid.org:8088/ziggrid/";

import ConnectionManager from 'appkit/ziggrid/connection_manager';
var connectionManager = ConnectionManager.create({ url: url, namespace: App });
App.register("connection_manager:main", connectionManager, { instantiate: false});

App.inject('component:bean-player', 'connectionManager', 'connection_manager:main');

export default App;


