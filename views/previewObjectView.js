var previewObjectView = Backbone.View.extend({
    
    tagName: 'tr',

    template: _.template($('#previewTemplate').html()),

    events: {

    },

    initialize: function() {            
        this.model.bind('change', this.render, this);
        this.render();
    },
    render: function() {            
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});