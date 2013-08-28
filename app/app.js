import Resolver from 'resolver';
import Store from 'appkit/store';
import demux from 'appkit/ziggrid/demux';

var App = Ember.Application.create({
  LOG_ACTIVE_GENERATION: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'appkit', // TODO: loaded via config
  Store: Store,
  Resolver: Resolver
});

var container = App.__container__;

import routes from 'appkit/routes';
App.Router.map(routes); // TODO: just resolve the router

App.deferReadiness();

var url = "http://couchconf.ziggrid.org:8088/ziggrid/";

import ConnectionManager from 'appkit/ziggrid/connection_manager';


var connectionManager = new ConnectionManager(url, container);

container.register("connection_manager:main", connectionManager);


export default App;
