function Generator(url, callback) {
  var conn = null;
  var open = {
    url: url + "generator",
    transport: 'websocket',
    fallbackTransport: 'long-polling',

    // handle the "open" message
    onOpen: function(response) {
      console.log("opened generator connection with response", response);
      //if (callback && callback.ready)
        //callback.ready();
    },

    // and then handle each incoming message
    onMessage: function(msg) {
      if (msg.status === 200) {
        console.log(msg.responseBody);
        var body = JSON.parse(msg.responseBody);
        //if (body["error"]) {
          //if (callback && callback.error)
            //onError(body["error"]);
        //}
      } else {
        //console.log("HTTP Error:", msg.status);
        //if (callback && callback.error)
          //onError("HTTP Error: " + msg.status);
      }
    }
  };
  conn = jQuery.atmosphere.subscribe(open);

  /*
    return Generator.create(endpoint, {
      ready: function() {
        console.log("ZG ready, enable buttons");
      },
      error: function(msg) {
        console.log("ZG: Error detected: ",  msg);
      }
    });
  */

  function send(msg) {
    //if (conn != null) {
    console.log(msg);
    conn.push(msg);
    //} else
      //delayed.push(msg);
  }

  this.start = function() {
    send(JSON.stringify({"action":"start"}));
  };

  this.stop = function() {
    send(JSON.stringify({"action":"stop"}));
  };

  this.setDelay = function(ms) {
    send(JSON.stringify({"action":"delay","size":ms}));
  };
}

Generator.create = function(url, callback) {
  return new Generator(url, callback);
};

export default Generator;

