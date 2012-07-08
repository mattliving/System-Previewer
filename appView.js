var appView = Backbone.View.Extend({

	el: $('#previewer'),

	events: {
		"click #sortById": "sortById",
		"click #sortByAccountName": "sortByAccountName",
		"click #sortByObjectName": "sortByObjectName",
		"submit #searchBar": "searchOnEnter",
		"click #searchBtn": "searchOnClick"
	},

	initialize: function() {

		this.sortById = this.$('#sortById');
		this.sortByAccountName = this.$('#sortByAccountName');
		this.sortByObjectName = this.$('#sortByObjectName');
		this.searchBar = this.$('#searchBar');
		this.searchBtn = this.$('#searchBtn');

		previewObjects.bind('all', this.render, this);

		/* JSON request
		previewObjects.fetch(); */
	},

	render: function() {
		previewObjects.each(
			var view = new previewObjectView({model: previewObject});
			this.$('.tbody').append(view.render().el));
	},

	sortById: function() {

	},

	sortByAccountName: function() {

	},

	sortByObjectName: function() {

	},

	searchOnEnter: function() {

	},

	searchOnClick: function() {

	}

	var app = new appView;

});