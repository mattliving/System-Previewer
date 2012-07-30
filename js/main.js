$(document).ready(function() {
	/* Twitter Bootstrap code */
	$('.dropdown-toggle').dropdown();

	/* Model representing an individual row in our table */
	var previewObject = Backbone.Model.extend({
    
	    defaults: {
	        accountId: null,
	        accountName: "",
	        objectName: "",
	        type: "",
	        isPublished: "",
	        previewLink: "",
	        fbLink: "",
	        info: {
	        	appname: "",
	        	owner: "",
	        	theme: "",
	        	objectId: null,
	        	createdBy: "",
	        	modifiedBy: "",
	        	createdOn: "",
	        	modifiedOn: "",
	        	publishDate: "",
	        	expiryDate: ""
	        }
	    },

	    initialize: function() {
	    },

	    clear: function() {
	    	this.destroy();
	    }
	});

	/* Collection of preview objects */
	var previewObjectTable = Backbone.Collection.extend({

	    model: previewObject,

	    // http://test.engagesciences.com/m/dashboard/listObjects
	    url: "http://192.168.0.5/systempreviewer/data/test.json",

	    /* Filter down the list of all campaigns that have been published */
	    published: function() {
	        return this.filter(function(previewObject) { 
	        	return previewObject.get('isPublished').match(/status.*.published/); 
	        });
	    },

	    /* Filter down the list to only campaigns that have not yet been published */
	    unpublished: function() {
	        return this.without.apply(this, this.published());
	    }
	});

	/* Main cached collection of preview objects */
	var previewObjects = new previewObjectTable;
	/* Main view consisting of individual preview objects
	   and bound to our collection */
	var tableView;

	var previewTableView = Backbone.View.extend({

		el: $("tbody"),

		initialize: function() {
			this.collection = new previewObjectTable(previewObjects.models);
			this.states = {
				filterType: "type.displayschedule.all",
				togglePublished: false
			};
			this.bind("change:filterType", this.filterByType, this);
			this.collection.bind("reset", this.render, this);
			this.render();
		},

		renderPreviewObject: function(previewObject) {
			var view = new previewObjectView({model: previewObject});
			this.$el.append(view.render().el);
		},

		render: function() {
			this.$el.empty();
			var that = this;
	        _.each(this.collection.models, function (item) {
	            that.renderPreviewObject(item);
	        }, this);
	        $('[rel=tooltip]').tooltip();
			$('[rel=popover]').popover();
		},

		filterByType: function(searchValue) {
			this.collection.reset(previewObjects.models, {silent: true});

			if (searchValue != "") {
				var searchResults = _.filter(this.collection.models, function(item) {
				return (item.get('accountId').toString() === searchValue)
					|| (item.get('accountName') === searchValue);
				});
				this.collection.reset(searchResults, {silent: true});
			}

			if (this.states.filterType !== "type.displayschedule.all") {

				var filterType = this.states.filterType,
					filtered = _.filter(this.collection.models, function(item) {
						return item.get('type') === filterType;
					});
				this.collection.reset(filtered, {silent: true});
			}

			if (this.states.togglePublished) {
				this.collection.reset(this.collection.published(), {silent: true});
			}

			this.collection.trigger("reset");
		}
	});

	var previewObjectView = Backbone.View.extend({
    
	    tagName: "tr",

	    template: _.template($('#previewTemplate').html()),

	    events: {
	    },

	    initialize: function() {            
	        this.model.bind('change', this.render);
	        this.model.bind('destroy', this.destroy);
	    },
	    render: function() {   
	    	this.$el.html(this.template(this.model.toJSON()));
	        return this;
	    },

	    clear: function() {
	    	this.model.clear();
	    }
	});

	var appView = Backbone.View.extend({

		el: $('#previewer'),

		events: {
			"click .navbar-fixed-top li": "setActive",
			"click #all": "setFilter",
			"click #page": "setFilter",
			"click #campaign": "setFilter",
			"click #sortById": "sortById",
			"click #sortByAccountName": "sortByAccountName",
			"click #sortByObjectName": "sortByObjectName",
			"submit #searchField": "search",
			"click #searchBtn": "search",
			"click #togglePublished": "togglePublished"
		},

		initialize: function() {

			// JSON request 
			var that = this;
			previewObjects.fetch({success: function() {
				tableView = new previewTableView();

				/* Init preview frame to hold the link for the first model in our collection */
				$('#previewFrame').attr('src',previewObjects.first().get('previewLink'));
				/* Init typeahead. Must occur after collection has been initialised */
				that.initTypeahead();
			}});

			this.bind("change:searchField", this.clearSearchField, this);
			this.searchField = $('#searchField');
			this.sortState = "";
		},

		setActive: function(e) {
			$('.navbar-fixed-top li').removeClass('active');
			$(e.currentTarget).addClass('active');
		},

		/* Uses the id of the nav dropdown to set the filter state of our view */
		setFilter: function(e) {
			var temp = "type.displayschedule." + e.currentTarget.id;
			if (tableView.states.filterType === temp) this.clearSearchField();
			tableView.states.filterType = temp;
			tableView.trigger("change:filterType", this.searchField.val());
		},

		search: function() {
			tableView.trigger("change:filterType", this.searchField.val());	
		},

		clearSearchField: function() {
			this.searchField.val("");
		},

		sortById: function() {
			if (this.sortState === "byId") {
				tableView.collection.comparator = function(previewObject) {
					return -previewObject.get("accountId");
				};
				this.sortState = "";
			}
			else {
				tableView.collection.comparator = function(previewObject) {
					return previewObject.get("accountId");
				};
				this.sortState = "byId";
			}
			tableView.collection.sort();
		},

		sortByAccountName: function() {
			tableView.collection.comparator = function(previewObject) {
				return previewObject.get("accountName");
			};
			tableView.collection.sort();
		},

		sortByObjectName: function() {
			tableView.collection.comparator = function(previewObject) {
				return previewObject.get("objectName");
			};
			tableView.collection.sort();
		},

		togglePublished: function(e) {
			tableView.states.togglePublished = e.currentTarget.checked;
			tableView.trigger("change:filterType", this.searchField.val());
		},

		/* Initialize typeahead source array to contain Account ID and 
		   Account Name model data for current collection using map-reduce */
		initTypeahead: function() {
			var array = _.map(previewObjects.models, function(previewObject) {
				return [previewObject.get("accountId").toString(),
						previewObject.get("accountName")];
			});
			array = _.uniq(_.reduce(array, function(a, b) {
				return a.concat(b);
			}, []));
			var options = {
				source: array
			};
			$('#searchField').typeahead(options);
		}
	});

	var app = new appView;

});
