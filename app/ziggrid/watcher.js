import demux from 'appkit/ziggrid/demux';

var unique = 1;
var container;

function Loader(type, entryType, id, opts) {
  var store = container.lookup('store:main');

  this.update = function(body) {
    var players = [];

    for (var i=0;i<body.length;i++) {
      var item = body[i];
      store.load(entryType, item[1], {f1: item[0]});
      players.push(item[1]);
    }

    store.load(type, id, {
      entries: players
    });
  };
}

function Watcher(_namespace) {
  this.namespace = _namespace;
  container = this.container = _namespace.__container__;
}

Watcher.prototype = {
  watch: function(typeName, opts) {
    var type = this.namespace[typeName]; // ED limitation
    var handle = unique;
    var store = container.lookup('store:main');

    unique++;
    store.load(type, handle, {});

    var model = store.find(type, handle);
    var hash = $.extend({
      watch: typeName,
      unique: handle
    }, opts);

    var entryType = this.namespace[typeName + 'Entry'];
    demux[handle] = new Loader(type, entryType, model.get('id'), opts);

    var stringified = JSON.stringify(hash);

    container.lookup('connection_manager:main').send(stringified);

    return model;
  },

  unwatch: function(handle) {
    // TODO
    //if (handle)
      //send(JSON.stringify({'unwatch': handle}));
  }
}

export default Watcher;
