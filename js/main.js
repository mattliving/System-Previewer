$(document).ready(function() {
	/* Button handlers */ 
	$('.nav li').click(function() {
		$this = $(this);
		if (!$this.hasClass('active')) {
			$this.addClass('active');
			$this.attr('id')==="pages" ? $('#campaigns').removeClass('active') : $('#pages').removeClass('active');
		}
	});

	var previewObject = Backbone.Model.extend({
    
	    defaults: {
	        accountId: "1",
	        accountName: "test",
	        objectName: "engage",
	        type: "",
	        isPublished: false,
	        previewLink: "http://www.mattliving.com",
	        fbLink: "http://www.mattliving.com"
	    },

	    initialize: function() {
	    }

	});

	var previewObjectTable = Backbone.Collection.extend({

	    // Reference to this collection's model.
	    model: previewObject,

	    // Filter down the list of all campaigns that have been published
	    published: function() {
	        return this.filter(function(previewObject) { 
	        	return previewObject.get('isPublished'); 
	        });
	    },

	    // Filter down the list to only campaigns that have not yet been published
	    unpublished: function() {
	        return this.without.apply(this, this.published());
	    }
	});

	var previewObjects = new previewObjectTable;

	var previewTableView = Backbone.View.extend({

		el: $("tbody"),

		initialize: function() {
			_.bindAll(this, "renderPreviewObject");
		},

		renderPreviewObject: function(previewObject) {
			var previewObject = new previewObjectView({model: previewObject});
			previewObject.render();
			$(this.el).append(previewObject.el);
		},

		render: function() {
			this.collection.each(this.renderPreviewObject);
		}
	});

	var previewObjectView = Backbone.View.extend({
    
	    tagName: "tr",

	    template: _.template($('#previewTemplate').html()),

	    events: {
	    },

	    initialize: function() {            
	    	_.bindAll(this, 'render');
	        this.model.bind('change', this.render);
	        this.model.bind('destroy', this.destroy);
	    },
	    render: function() {   
	    	this.$el.html(this.template(this.model.toJSON()));
	        return this;
	    }
	});

	var appView = Backbone.View.extend({

		el: $('#previewer'),

		events: {
			"click #sortById": "sortById",
			"click #sortByAccountName": "sortByAccountName",
			"click #sortByObjectName": "sortByObjectName",
			"submit #searchField": "searchOnEnter",
			"click #searchBtn": "searchOnClick",
			"click #togglePublished": "togglePublished"
		},

		initialize: function() {

			// this.sortById          = this.$('#sortById');
			// this.sortByAccountName = this.$('#sortByAccountName');
			// this.sortByObjectName  = this.$('#sortByObjectName');
			this.searchBar       = this.$('#searchBar');
			this.searchBtn       = this.$('#searchBtn');
			this.publishCheckbox = this.$('#togglePublished');

			//previewObjects.bind('add', this.addOne);
			//previewObjects.bind('reset', this.render);

			var view = new previewObject();
			previewObjects.add(view);

			var test = new previewObject({
				'accountId': '99',
				'accountName': 'nokia',
				'isPublished': 'true',
				'previewLink': 'http://www.engagesciences.com',
				'fbLink': 'http://www.mattliving.com'
			});
			previewObjects.add(test);

			this.addAll();

			/* Init preview frame to hold the link for the first model in our collection */
			$('#previewFrame').attr('src',previewObjects.first().get('previewLink'));

			/* JSON request
			previewObjects.fetch(); */
		},

		addOne: function(previewObject) {
			var view = new previewObjectView({model: previewObject});
			$('tbody').append(view.render().el);
		},

		addAll: function() {
			previewObjects.each(this.addOne);
		},

		render: function() {
			
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
			
		},

		togglePublished: function(e) {

			// Render only published items
			if (e.currentTarget.checked===true) {
				/*_.each(previewObjects.published(), function(preview) {
					preview.remove();
				});*/
				$('tr').hide();
			}
			else {
			}
		}
	});

	var app = new appView;

	/* Twitter Bootstrap code */
	$('.typeahead').typeahead();
	$('.dropdown-toggle').dropdown();
	$('[rel=tooltip]').tooltip();
});

/*

{ %> <i class="icon-ok-sign"></i> %< } 
					else { %> <i class="icon-remove-sign"></i> %< } */