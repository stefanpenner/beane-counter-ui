import Resolver from 'resolver';
import Store from 'appkit/store';
import demux from 'appkit/ziggrid/demux';
import Player from 'appkit/models/player';
import watcherInitializer from 'appkit/initializers/watcher';
import csvInitializer from 'appkit/initializers/csv';
import connectionManagerInitializer from 'appkit/initializers/connection_manager';
import routes from 'appkit/routes';
import BeanProduct from 'appkit/components/bean-production';
import BeanLeaderboard from 'appkit/components/bean-leaderboard';
import BeanHomeruns from 'appkit/components/bean-homeruns';

// Enable late registration helpers/components
Ember.FEATURES['container-renderables'] = true;

var App = Ember.Application.extend({
  modulePrefix: 'appkit', // TODO: loaded via config
  Store: Store,
  Resolver: Resolver,
  gameDateRanges: {
    '2006': [92, 274],
    '2007': [91, 274],
    '2008': [85, 274],
    '2009': [95, 279],
    '2010': [94, 276],
    '2011': [90, 271],
    '2012': [88, 277]
  }
});

App.initializer(watcherInitializer);
App.initializer(csvInitializer);
App.initializer(connectionManagerInitializer);

App = App.create();
App.Router.map(routes); // TODO: just resolve the router
App.deferReadiness(); // defering to allow sync boot with Ziggrid

function round(val) {
  if (!isNaN(val) && !/^\d+$/.test(val)) {
    return val.toFixed(3);
  } else {
    return (val || val === 0) ? val : 'N/A';
  }
}

App.register('helper:round', Ember.Handlebars.makeBoundHelper(round));

App.register('helper:name-from-code', Ember.Handlebars.makeBoundHelper(function(code) {
  return Player.nameFromCode(code) || code;
}));

App.register('helper:quadrant-value', Ember.Handlebars.makeBoundHelper(function(value) {
  value = (value && value > 0 && value < 3) ? value : Math.random() * 0.3 + 0.3;
  return round(value);
}));

// TODO: happier way to do this automatically?
// This way is bad because the component subclasses don't
// get their injections...
Ember.Handlebars.helper('bean-production', BeanProduct);
Ember.Handlebars.helper('bean-leaderboard', BeanLeaderboard);
Ember.Handlebars.helper('bean-homeruns', BeanHomeruns);

// For our range input in bean-player
Ember.TextField.reopen({
  attributeBindings: ['step']
});

export default App;
