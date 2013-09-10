import PLAYER_SEASON from 'appkit/player_season_to_date_data';
import demux from 'appkit/ziggrid/demux';

var container;

function Loader(type, entryType, id) {
  var store = container.lookup('store:main');

  this.update = type === entryType ? updateIndividualThing : updateTabularData;

  function updateTabularData(body) {
    var rows = [];

    for (var i = 0; i < body.length; i++) {
      var item = body[i];

      var attrs = {};
      attrs[Ember.keys(entryType.model)[0]] = item[0];

      store.load(entryType, item[1], attrs);
      rows.push(item[1]);
    }

    store.load(type, id, {
      table: rows
    });
  }

  function updateIndividualThing(body) {
    body.handle_id = id;
    store.load(type, body.id || id, body);
  }
}

function Watcher(_namespace) {
  this.namespace = _namespace;
  container = this.container = _namespace.__container__;
}

var gameDates = [];

Watcher.prototype = {
  watchGameDate: function() {
    var handle = ++demux.lastId;

    demux[handle] = {
      update: function(a) {
        gameDates.pushObject(a);
      }
    };

    var query = {
      watch: 'GameDate',
      unique: handle
    };

    var stringified = JSON.stringify(query);

    var connectionManager = container.lookup('connection_manager:main');
    connectionManager.send(stringified);

    //this.sendFakeGameDates();

    return gameDates;
  },

  keepSendingGameDates: false,
  sendFakeGameDates: function() {

    if (this.keepSendingGameDates) {
      gameDates.pushObject({
        day: gameDates.length
      });
    }

    Ember.run.later(this, 'sendFakeGameDates', 400);
  },

  watch: function(typeName, entryTypeName, opts, updateHandler) {
    var type = this.namespace[typeName]; // ED limitation
    var handle = ++demux.lastId;
    var store = container.lookup('store:main');

    store.load(type, handle, {});

    var model = store.find(type, handle);
    var hash = $.extend({
      watch: typeName,
      unique: handle
    }, opts);

    var entryType = this.namespace[entryTypeName];

    demux[handle] = updateHandler ? { update: updateHandler } :
                    new Loader(type, entryType, model.get('id'), opts);

    var stringified = JSON.stringify(hash);

    // TODO: Change this to forward to ZiggridObserver.

    // Send the JSON message to the server to begin observing.
    var connectionManager = container.lookup('connection_manager:main');
    connectionManager.send(stringified);

    return model;
  },

  unwatch: function(handle) {
    var connectionManager = container.lookup('connection_manager:main');
    connectionManager.send(JSON.stringify({ unwatch: handle }));
  }
};

export default Watcher;
