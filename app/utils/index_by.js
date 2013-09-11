function indexBy(property, collection) {
  var index = {};

  collection.forEach(function(entry) {
    index[Ember.get(entry, property)] = entry;
  });

  return index;
}

export default indexBy;
