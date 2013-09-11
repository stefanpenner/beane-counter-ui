// TODO: move this elsewhere, at least up to ApplicationRoute
import Watcher from 'appkit/ziggrid/watcher';

var initializer = {
  name: 'ziggrid-watcher',
  initialize: function(container, application) {
    var watcher = new Watcher(App);
    application.register('watcher:main', watcher, { instantiate: false });
  }
};

export default initializer;
