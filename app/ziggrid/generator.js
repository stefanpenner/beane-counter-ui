import flags from 'appkit/flags';

function Generator(url, callback) {
  var open = {
    url: url + 'generator',
    transport: 'websocket',
    fallbackTransport: 'long-polling',

    onOpen: function(response) {
      if (flags.LOG_WEBSOCKETS) {
        console.log('opened generator connection with response', response);
      }
    },

    // and then handle each incoming message
    onMessage: function(msg) {
      if (msg.status === 200) {
        if (flags.LOG_WEBSOCKETS) {
          console.log(msg.responseBody);
        }
        var body = JSON.parse(msg.responseBody);
      } else {
        console.log('Generator HTTP Error:', msg.status);
      }
    }
  };

  var conn = this.conn = jQuery.atmosphere.subscribe(open);
}

Generator.prototype = {

  hasSetDelay: false,

  send: function(msg) {
    console.log('Sending generator message', msg);
    this.conn.push(msg);
  },

  start: function() {
    if (!this.hasSetDelay) {
      // Don't overload the generator; give it a moderate delay the first time.
      this.setDelay(20);
      this.hasSetDelay = true;
    }

    this.send(JSON.stringify({'action':'start'}));
  },

  stop: function() {
    this.send(JSON.stringify({'action':'stop'}));
  },

  setDelay: function(ms) {
    this.send(JSON.stringify({'action':'delay','size':ms}));
  }
};

Generator.create = function(url, callback) {
  return new Generator(url, callback);
};

export default Generator;

