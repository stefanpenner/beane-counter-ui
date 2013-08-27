var Adapter = DS.Adapter.extend({
  init: function() {
    this._super.apply(this, arguments);
  },

  /** Start the ball rolling by "finding" a table.  We ignore the "type" and just look at the "id" as the table name
   */
  findQuery: function(store, type, opts, array) {
  },

  find: function(store, type, id) {
    throw "FindById not supported - use watch()";
  },

  // I'm not sure that I really want to support this behavior
  // But at least it's not one at a time
  createRecords: function(store, type, set) {
    throw "Create not yet supported";
  },

  createRecord: function() {
    throw "Create not yet supported";
  },

  updateRecord: function() {
    throw "Ziggrid does not support updating";
  },

  deleteRecord: function() {
    throw "Ziggrid does not support deleting";
  },

  toString: function() {
    return "Ziggrid.Adapter";
  }
});

export default Adapter;

