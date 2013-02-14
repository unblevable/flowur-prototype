define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Bubble = Backbone.Model.extend({

        defaults: {
            parent: null,
            isTiny: true,
            isHighlighted: false,
            highlightDistance: 0.625
        },

        initialize: function() {
        }
    });

    return Bubble;
});
