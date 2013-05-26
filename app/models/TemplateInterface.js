define(function(require, exports, module) {
    var _           = require('underscore'),
        Backbone    = require('backbone');

    var TemplateInterface = Backbone.Model.extend({

        defaults: {
            isLayoutsScrolling: false,
            isThemesScrolling: false,
            selectedCardView: null
        },

        initialize: function() {
        }
    });

    return TemplateInterface;
});
