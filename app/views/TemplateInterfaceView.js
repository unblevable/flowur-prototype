define(function(require, exports, module) {
    var $                           = require('jquery'),
        _                           = require('underscore'),
        Backbone                    = require('backbone'),
        IScroll                     = require('iscroll'),
        TemplateInterfaceTemplate   = require('text!templates/template_interface.html'),
        TemplateInterfaceCard       = require('models/TemplateInterfaceCard'),
        TemplateInterfaceCardView   = require('views/TemplateInterfaceCardView');

    var TemplateInterfaceView = Backbone.View.extend({

        id: 'template-interface',

        templateInterfaceTemplate: _.template(TemplateInterfaceTemplate),

        events: {
        },

        initialize: function() {
            _(this).bindAll('render');

            _.defer(function() {

                this.layoutScroller = new IScroll('template-interface-layout-scroller', {
                    hScroll: false,
                    vScrollbar: false,
                });

                this.themeScroller = new IScroll('template-interface-theme-scroller', {
                    hScroll: false,
                    vScrollbar: false,
                });

            }.bind(this));
        },

        render: function() {
            this.$el.html(this.templateInterfaceTemplate);

            for(var i = 0; i < 5; i++) {
                var templateInterfaceCard = new TemplateInterfaceCard(),
                    templateInterfaceCardView = new TemplateInterfaceCardView({ model: templateInterfaceCard });
                var listElement = $('<li></li>');
                listElement.append(templateInterfaceCardView.$el);
                this.$('#template-interface-layout-selection ul').append(listElement);
                templateInterfaceCardView.render();
            }

            for(var i = 0; i < 5; i++) {
                var templateInterfaceCard = new TemplateInterfaceCard(),
                    templateInterfaceCardView = new TemplateInterfaceCardView({ model: templateInterfaceCard });
                var listElement = $('<li></li>');
                listElement.append(templateInterfaceCardView.$el);
                this.$('#template-interface-theme-selection ul').append(listElement);
                templateInterfaceCardView.render();
            }
        }
    });

    return TemplateInterfaceView;
});
