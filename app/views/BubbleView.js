define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var BubbleView = Backbone.View.extend({

        className: 'bubble',

        minimizedTemplate: _.template($('#bubble-template').html()),

        maximizedTemplate: _.template($('#bubble-maximized-template').html()),

        events: {
            'mouseenter': 'rise',
            'mouseleave': 'fall',
            'click': 'maximize',
            'dblclick': 'maximize',
            'keypress textarea': 'disableReturn',
            'keyup textarea': 'update',
            'focus textarea': 'lighten',
            'blur textarea': 'darken'
        },

        initialize: function() {
            _(this).bindAll('render', 'renderCount', 'rise', 'fall', 'handleNodeSelect', 'maximize', 'minimize', 'update', 'lighten', 'darken', 'fillMinimizedTemplate');

            // model-change events
            this.model.on({
                "change:count": this.renderCount
            });

            // attach non-DOM/external events
            this.on('nodeHighlight', this.rise);
            this.on('nodeUnhighlight', this.fall);
            this.on('nodeSelect', this.handleNodeSelect);
        },

        render: function() {
            this.fillMinimizedTemplate();

            return this;
        },

        // event handlers -----------------------------------------------------

        renderCount: function() {
            this.$el.find('.remaining-character-count').text(this.model.get('maxCount') - this.model.get('count'));
        },

        rise: function() {
            if(!this.model.get('isHighlighted')) {
                this.$el.stop(true, true).animate({ bottom: pxToRem(parseFloat(this.$el.css('bottom'))) + this.model.get('highlightDistance') + 'rem'}, 0, 'linear', this.model.set('isHighlighted', true));
            }
        },

        fall: function() {
            if(this.model.get('isHighlighted')) {
                this.$el.stop(true, true).animate({ bottom: pxToRem(parseFloat(this.$el.css('bottom'))) - this.model.get('highlightDistance') + 'rem'}, 0, 'linear', this.model.set('isHighlighted', false));
            }
        },

        handleNodeSelect: function(event) {
            if(this.model.get('isMini')) {
                this.maximize();
            } else {
                this.minimize();
            }
        },

        maximize: function() {
            // double check?
            if(this.model.get('isMini')) {
                this.$el.html(this.maximizedTemplate({
                    remainingCharacterCount: this.model.getRemainingCount(),
                    text: this.model.get('text')
                }));
                this.$el.removeClass('bubble');
                this.$el.addClass('maximized-bubble');
                this.$el.find('textarea').focus();
                this.$el.find('textarea').select();
                this.model.set('isMini', false);
            }
        },

        minimize: function() {
            this.fillMinimizedTemplate();
            this.$el.addClass('bubble');
            this.$el.removeClass('maximized-bubble');
            this.model.set('isMini', true);
        },

        disableReturn: function(event) {
            if(event.which === 13) {
                event.preventDefault();
            }
        },

        update: function(event) {
            // save text
            this.model.set('text', this.$el.find('textarea').val());

            // update count
            this.model.set('count', this.model.get('text').length);

            // mini view on enter key
            if(event.which === 13) {
                this.minimize();
            }
        },

        lighten: function() {
        },

        darken: function() {
        },

        // other methods ------------------------------------------------------

        fillMinimizedTemplate: function() {
            this.$el.html(this.minimizedTemplate({
                text: this.model.get('text')
            }));

        }
    });

    return BubbleView;
});
