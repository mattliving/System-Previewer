var previewObject = Backbone.Model.extend({
    
    defaults: {
        accountId: "2",
        accountName: "test",
        objectName: "engage",
        isPublished: false,
        btnLinks: { 
            preview: "",
            fbLink: ""
        }
    },

    initialize: function() {
        this.set({
            "accountId": this.defaults.accountId,
            "accountName": this.defaults.accountName,
            "objectName": this.defaults.objectName,
            "isPublished": this.defaults.isPublished,
            "btnLinks": this.defaults.btnLinks
        });
    }
});

var previewObjectTable = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: previewObject,

    // Filter down the list of all campaigns that have been published
    published: function() {
        return this.filter(function(photo){ return photo.get('published'); });
    },

    // Filter down the list to only campaigns that have not yet been published
    unpublished: function() {
        return this.without.apply(this, this.published());
    }

    var previewObjects = new previewObjectTable;
});