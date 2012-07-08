var router = Backbone.Router.extend({
    routes: {
        "pages/:id": "getPages",
        "campaigns/:id": "getCampaigns",
        "*actions": "defaultRoute" // Backbone will try match the route above first
    },
    getPages: function( id ) {
        alert( "Get accountId " + id );   
    },
    getCampaigns: function( id ) {
        alert( "Get accountId " + id );
    }
    defaultRoute: function( actions ){
        alert( actions ); 
    }
});
// Instantiate the router
var app_router = new router;
// Start Backbone history a neccesary step for bookmarkable URL's
Backbone.history.start();