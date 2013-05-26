define(function(require, exports, module) {
    var $                               = require('jquery'),
        _                               = require('underscore'),
        Backbone                        = require('backbone'),
        TemplateInterfaceCardTemplate       = require('text!templates/template_interface_card.html');

    var TemplateInterfaceCardView = Backbone.View.extend({

        className: 'template-interface-card',

        templateInterfaceCardTemplate: _.template(TemplateInterfaceCardTemplate),

        events: {
        },

        initialize: function() {
            _(this).bindAll('render');
        },

        render: function() {
            this.$el.html(this.templateInterfaceCardTemplate);
        }
    });

    return TemplateInterfaceCardView;
});
