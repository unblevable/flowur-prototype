define(function(require, exports, module) {
    var $                               = require('jquery'),
        _                               = require('underscore'),
        Backbone                        = require('backbone'),
        TemplateInterfaceCardTemplate       = require('text!templates/template_interface_card.html');

    var TemplateInterfaceCardView = Backbone.View.extend({

        className: 'template-interface-card',

        templateInterfaceCardTemplate: _.template(TemplateInterfaceCardTemplate),

        events: {
            'mouseenter': function() {
                if(!this.model.get('isSelected')) {
                    this.overlayElement.removeClass('selected');
                    this.overlayElement.addClass('highlighted');
                    this.overlayElement.animate({
                        opacity: 'show',
                    }, 250);
                }

                console.log('enter');
                console.log(this.model.get('isSelected'));
            },
            'mousemove': function() {
                if(!this.model.get('isSelected')) {
                    this.overlayElement.removeClass('selected');
                    this.overlayElement.addClass('highlighted');
                    this.overlayElement.animate({
                        opacity: 'show',
                    }, 250);
                }
            },
            'mouseleave': function() {
                if(!this.model.get('isSelected')) {
                    this.overlayElement.animate({
                        opacity: 'hide',
                    }, 150);
                }
            },
            'click': function() {
                if(!(this.model.get('parent').get('isLayoutsScrolling') || this.model.get('parent').get('isThemesScrolling'))) {

                    // If the clicked card is selected.
                    if(this.model.get('isSelected')) {
                        this.model.set('isSelected', false);
                        this.overlayElement.removeClass('selected');
                        this.overlayElement.addClass('highlighted');

                    // If the clicked card is not selected.
                    } else {
                        this.model.set('isSelected', true);
                        this.overlayElement.removeClass('highlighted');
                        this.overlayElement.addClass('selected');

                        // Unselected the previously selected card.
                        var previousSelectedCardView = this.model.get('parent').get('selectedCardView');
                        if(previousSelectedCardView && previousSelectedCardView !== this) {
                            previousSelectedCardView.overlayElement.animate({ opacity: 'hide' }, 150);
                            previousSelectedCardView.model.set('isSelected', false);
                        }

                        this.model.get('parent').set('selectedCardView', this);
                    }
                }
            }
        },

        initialize: function() {
            _(this).bindAll('render');
        },

        render: function() {
            this.$el.html(this.templateInterfaceCardTemplate);

            this.overlayElement = this.$('.template-interface-card-overlay');

            this.$('.template-interface-card-overlay').hide();
        }
    });

    return TemplateInterfaceCardView;
});
