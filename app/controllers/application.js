var ApplicationController = Ember.Controller.extend({

  currentPage: 0,

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
