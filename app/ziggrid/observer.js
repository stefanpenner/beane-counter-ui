import demux from 'appkit/ziggrid/demux';

function Observer(url, callback) {

  url = url + 'updates';
  console.log("Observer connecting at " + url);

  var conn = jQuery.atmosphere.subscribe({
    url: url,

    transport: 'websocket',
    fallbackTransport: 'long-polling',

    onOpen: function(response) {
      callback(conn);
    },

    onMessage: function(msg) {
      if (msg.status === 200) {
        // TODO: why are we still getting deliveryFor messages in connectionManager?
        console.log("Received message " + msg.responseBody);
        var body = JSON.parse(msg.responseBody);
        if (body["deliveryFor"]) {
          var h = demux[body["deliveryFor"]];
          if (h && h.update)
            h.update(body["table"]);
        } else {
          console.error("unknown message type");
        }
      } else {
        console.error("HTTP error");
      }
    }
  });
}

Observer.create = function(url, callback) {
  return new Observer(url, callback);
};

export default Observer;
