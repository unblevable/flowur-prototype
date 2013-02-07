define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Node = Backbone.Model.extend({
        // multiple dom elements
        defaults: {
            x: 0,
            y: 0,
            style: (function() {
                return {
                    left: 0,
                    top: 0,
                    'background-image': 'url("../assets/node.png")'
                }
            }())
        },

        initialize: function() {
        }
    });

    return Node;
});
