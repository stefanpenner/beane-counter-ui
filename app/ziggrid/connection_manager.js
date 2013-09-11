import Generator from 'appkit/ziggrid/generator';
import Observer from 'appkit/ziggrid/observer';
import demux from 'appkit/ziggrid/demux';
import flags from 'appkit/flags';

var ConnectionManager = Ember.Object.extend({

  url: null,

  // Reference to the global app namespace where we'll be installing
  // dynamically generated DS.Model classes
  namespace: null,

  generator: null,

  establishConnection: function() {

    var self = this;

    // this.container = container;
    this.observers = {};
    //this.models = {};
    this.initNeeded = 1;
    this.initCompleted = 0;

    var messages = [];

    var conn = this.conn = jQuery.atmosphere.subscribe({
      url: this.url + "updates",
      transport: 'websocket',
      fallbackTransport: 'long-polling',

      // handle the "open" message
      onOpen: function(response) {
        conn.push(JSON.stringify({ action: "init" }));
      },

      // and then handle each incoming message
      onMessage: function(msg) {
        // Have to clone because jQuery atmosphere reuses response objects.
        messages.push({
          status: msg.status,
          responseBody: msg.responseBody
        });
        Ember.run.throttle(self, 'flushMessages', messages, 150);
      }
    });
  }.on('init'),

  flushMessages: function(messages) {
    while (messages.length) {
      var message = messages.shift();
      this.handleMessage(message);
    }
  },

  handleMessage: function(msg) {
    if (msg.status === 200) {

      if (flags.LOG_WEBSOCKETS) {
        console.log("Received message " + msg.responseBody);
      }

      var body = JSON.parse(msg.responseBody);

      if (body["deliveryFor"]) {
        // TODO: shouldn't this be in observer.js?
        var h = demux[body["deliveryFor"]];
        if (h && h.update) {
          if (body.payload.table) {
            // Assume tabular data
            h.update(body.payload.table);
          } else {
            h.update(body.payload);
          }
        }
      } else if (body["error"]) {
        console.error(body['error']);
      } else if (body["modelName"]) {
        this.registerModel(body.modelName, body.model);
      } else if (body["server"]) {
        var endpoint = body.endpoint,
        addr = "http://" + endpoint + "/ziggrid/",
        server = body.server;

        if (flags.LOG_WEBSOCKETS) {
          console.log("Have new " + server + " server at " + endpoint);
        }
        this.registerServer(server, addr);

      } else if (body["status"]) {
        var stat = body["status"];
        if (stat === "initdone") {
          this.initDone();
        } else {
          console.log("Do not recognize " + stat);
        }
      } else
        console.log("could not understand " + msg.responseBody);
    } else {
      console.log("HTTP Error:", msg.status);
      //if (callback && callback.error)
      //callback.error("HTTP Error: " + msg.status);
    }
  },

  registerModel: function(name, model) {

    var attrs = {};
    for (var p in model) {
      if (!model.hasOwnProperty(p)) { continue; }

      var type = model[p];
      if (type.rel === "attr") {
        attrs[p] = DS.attr(type.name);
      } else if (type.rel === "hasMany") {
        attrs[p] = DS.hasMany("App." + type.name.capitalize());
      } else {
        console.log("Unknown type:", type);
      }
    }

    var newClass = DS.Model.extend(attrs);
    newClass.reopenClass({
      model: model
    });

    this.namespace[name] = newClass;
  },

  registerServer: function(server, addr) {
    var self = this;
    if (server === "generator") {
      this.set('generator', Generator.create(addr));
    } else if (server === "ziggrid") {
      //return;
      if (!this.observers[addr]) {
        this.initNeeded++;

        this.observers[addr] = Observer.create(addr, function() {
          self.observers[addr] = self.conn;
          self.initDone();
        });
      }
    }
  },
  initDone: function() {
    if (++this.initCompleted === this.initNeeded) {
      window.App.advanceReadiness();
    }
  },

  send: function(msg) {
    var observers = this.observers;

    if (flags.LOG_WEBSOCKETS) {
      console.log("sending ", msg, "to", observers);
    }

    for (var u in observers) {
      if (observers.hasOwnProperty(u)) {
        observers[u].push(msg);
      }
    }
  }
});


export default ConnectionManager;

