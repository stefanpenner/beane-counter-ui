var ApplicationController = Ember.Controller.extend({

  years: [2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013],

  selectedYear: 2008,

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
