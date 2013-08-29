var ApplicationController = Ember.Controller.extend({

  // TODO: should be 0
  currentPage: 1,

  // TODO: move to ApplicationView when it works
  pageContainerStyle: function() {
    var currentPage = this.get('currentPage');
    return "margin-left: " + (-960 * currentPage) +  "px;";
  }.property('currentPage'),

  actions: {
    togglePage: function() {
      this.set('currentPage', +!this.get('currentPage'));
    }
  }
});

export default ApplicationController;
