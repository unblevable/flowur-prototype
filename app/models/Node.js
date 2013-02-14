define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Node = Backbone.Model.extend({

        defaults: {
            x: 0,
            y: 0,
            type: 'question'
        },

        initialize: function(options) {
        },

        // non-Backbone methods -----------------------------------------------
    });

    return Node;
});
