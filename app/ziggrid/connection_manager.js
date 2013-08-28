import Generator from 'appkit/ziggrid/generator';
import Observer from 'appkit/ziggrid/observer';
import demux from 'appkit/ziggrid/demux';
// window.App;
var ConnectionManager = function(url, namespace /* container in the future */) {

  var self = this;

  this.namespace = namespace;
  // this.container = container;
  this.generators = {};
  this.observers = {};
  //this.models = {};
  this.initNeeded = 1;
  this.initCompleted = 0;

  var conn = this.conn = jQuery.atmosphere.subscribe({
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
          if (h && h.update) {
            h.update(body["table"]);
          }
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
              if (type.rel === "attr") {
                attrs[p] = DS.attr(type.name);
              } else if (type.rel === "hasMany") {
                attrs[p] = DS.hasMany("App." + type.name);
              } else {
                console.log("Unknown type:", type);
              }
            }

            var newClass = DS.Model.extend(attrs);

            namespace[name] = newClass;
            //namespace.register('model:' + name, newClass);

            //invModels[newClass] = name;
        } else if (body["server"]) {
          var endpoint = body.endpoint,
              addr = "http://" + endpoint + "/ziggrid/",
              server = body.server;

          console.log("Have new " + server + " server at " + endpoint);
          self.registerServer(server, addr);

        } else if (body["status"]) {
          var stat = body["status"];
          if (stat === "initdone") {
            self.initDone();
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
    }
  });
};

ConnectionManager.prototype = {
  registerServer: function(server, addr) {
    var self = this;
    if (server === "generator") {
      if (!this.generators[addr]) {
        this.generators[addr] = Generator.create(addr);
      }
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
    console.log("sending ", msg, "to", observers);
    for (var u in observers) {
      if (observers.hasOwnProperty(u)) {
        observers[u].push(msg);
      }
    }
  }
};


export default ConnectionManager;

