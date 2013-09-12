var Adapter = DS.Adapter.extend({
  /** Start the ball rolling by 'finding' a table.  We ignore the 'type' and just look at the 'id' as the table name
   */
  findQuery: function(store, type, opts, array) {
    throw new Error('findQuery not yet supported');
  },

  find: function(store, type, id) {
    throw new Error('FindById not supported - use watch()');
  },

  // I'm not sure that I really want to support this behavior
  // But at least it's not one at a time
  createRecords: function(store, type, set) {
    throw new Error('Create not yet supported');
  },

  createRecord: function() {
    throw new Error('Create not yet supported');
  },

  updateRecord: function() {
    throw new Error('Ziggrid does not support updating');
  },

  deleteRecord: function() {
    throw new Error('Ziggrid does not support deleting');
  },

  toString: function() {
    return 'Ziggrid.Adapter';
  }
});

export default Adapter;

