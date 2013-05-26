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
            'click': function() {
                console.log(this.model.get('isLayoutsScrolling'));
                console.log(this.model.get('isThemesScrolling'));
            }
        },

        initialize: function() {
            _(this).bindAll('render');

            _.defer(function() {

                this.layoutScroller = new IScroll('template-interface-layout-scroller', {
                    hScroll: false,
                    vScrollbar: false,
                    onScrollMove: function() {
                        this.model.set('isLayoutsScrolling', true);
                    }.bind(this),
                    onScrollEnd: function() {
                        this.model.set('isLayoutsScrolling', false);
                    }.bind(this)
                });

                this.themeScroller = new IScroll('template-interface-theme-scroller', {
                    hScroll: false,
                    vScrollbar: false,
                    onScrollMove: function() {
                        this.model.set('isThemesScrolling', true);
                    }.bind(this),
                    onScrollEnd: function() {
                        this.model.set('isThemesScrolling', false);
                    }.bind(this)

                });

            }.bind(this));
        },

        render: function() {
            this.$el.html(this.templateInterfaceTemplate);

            for(var i = 0; i < 5; i++) {
                var templateInterfaceCard = new TemplateInterfaceCard({ parent: this.model }),
                    templateInterfaceCardView = new TemplateInterfaceCardView({ model: templateInterfaceCard });
                var listElement = $('<li></li>');
                listElement.append(templateInterfaceCardView.$el);
                this.$('#template-interface-layout-selection ul').append(listElement);
                templateInterfaceCardView.render();
            }

            for(var i = 0; i < 5; i++) {
                var templateInterfaceCard = new TemplateInterfaceCard({ parent: this.model }),
                    templateInterfaceCardView = new TemplateInterfaceCardView({ model: templateInterfaceCard });
                var listElement = $('<li></li>');
                listElement.append(templateInterfaceCardView.$el);
                this.$('#template-interface-theme-selection ul').append(listElement);
                templateInterfaceCardView.render();
            }

            // not working...
            _.defer(function() {
                this.layoutScroller.refresh();
                this.themeScroller.refresh();
            }.bind(this));
        }
    });

    return TemplateInterfaceView;
});
