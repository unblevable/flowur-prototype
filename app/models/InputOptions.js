define(function(require, exports, module) {
    var _           = require('underscore'),
        Backbone    = require('backbone');

    var InputOptions = Backbone.Model.extend({

        defaults: {
            zoom: 100,
        },

        initialize: function() {
        }
    });

    return InputOptions;
});
