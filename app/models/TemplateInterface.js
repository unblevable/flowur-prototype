define(function(require, exports, module) {
    var _           = require('underscore'),
        Backbone    = require('backbone');

    var TemplateInterface = Backbone.Model.extend({

        defaults: {},

        initialize: function() {
        }
    });

    return TemplateInterface;
});
