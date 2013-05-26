define(function(require, exports, module) {
    var _           = require('underscore'),
        Backbone    = require('backbone');

    var TemplateInterfaceCard = Backbone.Model.extend({

        defaults: {
            isSelected: false
        },

        initialize: function() {
        }
    });

    return TemplateInterfaceCard;
});
