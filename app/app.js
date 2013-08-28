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

console.log("opening a connection to " + url);

var observers = {},
    generators = {},
    models = {},
    invModels = {},
    namespace = App,
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
        registerServer(server, addr);

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

var watcher = new Watcher();

function initDone() {
  ++initCompleted;
  if (initCompleted == initNeeded) {
    doload();
  }
}

function doload() {
  // TODO: we should have some notion of "unwatch"
  leaderboard = watcher.watch(Demo.Leaderboard_average_groupedBy_season,{"season":season});
  leaderboard.get('entries').addArrayObserver({
    arrayWillChange: function() {},
    arrayDidChange: function(array, params) {
      console.log("GOT ARRAY UPDATES");
      //handleLoading();
    }
  });
}

function registerServer(server, addr) {
  if (server === "generator") {
    if (!generators[addr]) {
      generators[addr] = Generator.create(addr);
    }
  } else if (server === "ziggrid") {
    if (!observers[addr]) {
      initNeeded++;

      observers[addr] = Observer.create(addr);
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
};

function Watcher() {
  this.watch = function(type, opts) {
    var handle = unique;
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
