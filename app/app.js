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

import routes from 'appkit/routes';
App.Router.map(routes); // TODO: just resolve the router

App.deferReadiness();

var url = "http://couchconf.ziggrid.org:8088/ziggrid/";

console.log("opening a connection to " + url);

var observers = {},
    generators = {},
    models = {},
    invModels = {},
    namespace = App,
    initNeeded = 1,
    initCompleted = 0,
    season = "2006",
    leaderboard = null,
    tables = {},
    unique = 1,
    store = null,
    currentTable = null;


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
    if (msg.status === 200) {
      console.log("Received message " + msg.responseBody);
      var body = JSON.parse(msg.responseBody);

      if (body["deliveryFor"]) {
        // TODO: shouldn't this be in observer.js?
        var h = demux[body["deliveryFor"]];
        if (h && h.update)
          h.update(body["table"]);
      } else if (body["error"]) {
        console.error(body['error']);
        //if (callback && callback.error)
          //callback.error(body["error"]);
      } else if (body["modelName"]) {
        var name = body["modelName"];
        var model = body["model"];
        var attrs = {};
        for (var p in model)
          if (model.hasOwnProperty(p)) {
            var type = model[p];
            if (type.rel === "attr")
              attrs[p] = DS.attr(type.name);
            else if (type.rel === "hasMany")
              attrs[p] = DS.hasMany("App."+type.name);
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
        registerServer(server, addr);

      } else if (body["status"]) {
        var stat = body["status"];
        if (stat === "initdone") {
          initDone();
        } else
          console.log("Do not recognize " + stat);
      } else
        console.log("could not understand " + msg.responseBody);
    } else {
      console.log("HTTP Error:", msg.status);
      //if (callback && callback.error)
        //callback.error("HTTP Error: " + msg.status);
    }
  }
});

var watcher = new Watcher();

function send(msg) {
  console.log("sending ", msg, "to", observers);
  for (var u in observers) {
    if (observers.hasOwnProperty(u))
      observers[u].push(msg);
  }
}

function initDone() {
  ++initCompleted;
  if (initCompleted === initNeeded) {
    App.advanceReadiness();
    doload();
  }
}

function doload() {
  // TODO: we should have some notion of "unwatch"
  leaderboard = watcher.watch(App.Leaderboard_average_groupedBy_season,{"season":season});
  leaderboard.get('entries').addArrayObserver({
    arrayWillChange: function() {},
    arrayDidChange: function(array, params) {
      console.log("GOT ARRAY UPDATES");
      //handleLoading();
    }
  });
  App.leaderboardEntries = leaderboard.get('entries');
}

function registerServer(server, addr) {
  if (server === "generator") {
    if (!generators[addr]) {
      generators[addr] = Generator.create(addr);
    }
  } else if (server === "ziggrid") {
    //return;
    if (!observers[addr]) {
      initNeeded++;

      observers[addr] = Observer.create(addr, function() {
        observers[addr] = conn;
        initDone();
      });
    }
  }
}

function Loader(type, entryType, id, opts) {
  this.update = function(body) {
    var players = [];
    for (var i=0;i<body.length;i++) {
      var item = body[i];
      store.load(entryType, item[1], {f1: item[0]});
      players.push(item[1]);
    }
    store.load(type, id, {entries: players});
  };
}

function Watcher() {
  this.watch = function(type, opts) {
    var handle = unique;
    store = App.__container__.lookup('store:main');
    unique++;
    store.load(type, handle, {});
    var ret = store.find(type, handle);
    var tn = invModels[type];
    var hash = $.extend({"watch": tn, "unique": handle}, opts);
    demux[handle] = new Loader(type, models[tn+"Entry"], ret.get('id'), opts);
    send(JSON.stringify(hash));
    return ret;
  };

  this.unwatch = function(handle) {
    if (handle)
      send(JSON.stringify({"unwatch": handle}));
  };
}

export default App;
