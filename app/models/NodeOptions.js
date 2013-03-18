define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var NodeOptions = Backbone.Model.extend({

        defaults: {
            isVisible: false,
            selectedNode: null,

            type: 'question',
            importance: 1.0,
        },

        initialize: function() {
        }
    });

    return NodeOptions;
});
