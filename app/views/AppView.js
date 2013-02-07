define(['jquery', 'underscore', 'backbone', 'models/App'], function($, _, Backbone, App) {
    var AppView = Backbone.View.extend({
        id: 'application',

        events: function() {
            return {
                // 'ready': 'resizePhases'
            }
        },

        initialize: function() {
        },
    });

    return AppView;
});
