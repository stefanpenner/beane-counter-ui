import demux from 'appkit/ziggrid/demux';

var unique = 1,
    namespace, // TODO: better way to share this container with Loader
    container;

function Loader(type, entryType, id, opts) {
  var store = container.lookup('store:main');
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

function Watcher(_namespace) {
  namespace = _namespace;
  container = namespace.__container__;

  this.watch = function(typeName, opts) {

    var type = App[typeName];
    var handle = unique;
    var store = container.lookup('store:main');
    unique++;
    store.load(type, handle, {});
    var ret = store.find(type, handle);
    var hash = $.extend({"watch": typeName, "unique": handle}, opts);

    var entryType = namespace[typeName + "Entry"];
    demux[handle] = new Loader(type, entryType, ret.get('id'), opts);

    var connectionManager = container.lookup("connection_manager:main");
    connectionManager.send(JSON.stringify(hash));
    return ret;
  };

  this.unwatch = function(handle) {
    // TODO
    //if (handle)
      //send(JSON.stringify({"unwatch": handle}));
  };
}

export default Watcher;
