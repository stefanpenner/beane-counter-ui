var get = Ember.get;

function groupBy(property, collection) {
  var index = {};

  collection.forEach(function(entry) {
    var key = get(entry, property);
    index[key] = index[key] || [];
    index[key].push(entry);
  });

  return index;
}

export default groupBy;
