import Resolver from 'resolver';
import Store from 'appkit/store';

var App = Ember.Application.create({
  LOG_ACTIVE_GENERATION: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'appkit', // TODO: loaded via config
  Store: Store,
  Resolver: Resolver
});

import routes from 'appkit/routes';
App.Router.map(routes); // TODO: just resolve the router

App.deferReadiness();

var url = "http://couchconf.ziggrid.org:8088/ziggrid/";
        //watcher = Ziggrid.init(Demo, Demo.store,

console.log("opening a connection to " + url);

var observers = {},
    generators = {},
    initNeeded = 1,
    initCompleted = 0;


import Generator from 'appkit/ziggrid/generator';
import Observer from 'appkit/ziggrid/observer';

var conn = jQuery.atmosphere.subscribe({
    url: url + "updates",
    transport: 'websocket',
    fallbackTransport: 'long-polling',

    // handle the "open" message
    onOpen: function(response) {
      conn.push(JSON.stringify({ action: "init" }));
    },

    // and then handle each incoming message
    onMessage: function(msg) {
      if (msg.status == 200) {
        console.log("Received message " + msg.responseBody);
        var body = JSON.parse(msg.responseBody);
        if (body["error"]) {
          if (callback && callback.error)
            callback.error(body["error"]);
        } else if (body["modelName"]) {
          var name = body["modelName"];
          var model = body["model"];
          var attrs = {};
          for (var p in model)
            if (model.hasOwnProperty(p)) {
              var type = model[p];
              if (type.rel == "attr")
                attrs[p] = DS.attr(type.name);
              else if (type.rel == "hasMany")
                attrs[p] = DS.hasMany("Demo."+type.name);
              else
                console.log("Unknown type:", type);
            }
            models[name] = namespace[name] = DS.Model.extend(attrs);
            invModels[models[name]] = name;
        } else if (body["server"]) {
          var endpoint = body.endpoint,
              addr = "http://" + endpoint + "/ziggrid/",
              server = body.server;

          console.log("Have new " + server + " server at " + endpoint);

          if (server === "generator") {
            if (!generators[addr]) {
              generators[addr] = Generator.create(addr);
            }
          } else if (server === "ziggrid") {

            if (!observers[addr]) {
              initNeeded++;

              Observer.create(addr);
               //TODO ALEX: MOVE to own file
            }

          }
        } else if (body["status"]) {
          var stat = body["status"];
          if (stat == "initdone") {
            initDone();
          } else
            console.log("Do not recognize " + stat);
        } else
          console.log("could not understand " + msg.responseBody);
      } else {
        console.log("HTTP Error:", msg.status);
        if (callback && callback.error)
          callback.error("HTTP Error: " + msg.status);
      }
    }
});



export default App;
