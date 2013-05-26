define(function(require, exports, module) {
    var _           = require('underscore'),
        Backbone    = require('backbone');

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
