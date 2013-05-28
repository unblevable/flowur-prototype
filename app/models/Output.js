define(function(require, exports, module) {
    var _           = require('underscore'),
        Backbone    = require('backbone');

    var Output = Backbone.Model.extend({

        defaults: {
            flowchart: null,
        },

        initialize: function() {
        }
    });

    return Output;
});
