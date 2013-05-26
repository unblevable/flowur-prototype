define(function(require, exports, module) {
    var _           = require('underscore'),
        Backbone    = require('backbone');

    var App = Backbone.Model.extend({

        defaults: {
            phases: ['input', 'template', 'share'],
            scroll: 0,
        },

        initialize: function() {
            _(this).bindAll();
        },
    });

    return App;
});
