define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var BubbleView = Backbone.View.extend({

        className: 'bubble',

        template: _.template($('#bubble-template').html()),

        events: {
        },

        initialize: function() {
            _(this).bindAll('render', 'rise', 'fall', 'maximize', 'minimize');

            // attach non-DOM events
           this.on('highlight', this.rise);
           this.on('unhighlight', this.fall);
        },

        render: function() {
            this.$el.html(this.template);

            return this;
        },

        rise: function() {
            if(!this.model.get('isHighlighted')) {
                console.log(pxToRem(this.$el.css('bottom')));
                this.$el.stop(true, true).animate({ bottom: pxToRem(parseFloat(this.$el.css('bottom'))) + this.model.get('highlightDistance') + 'rem'}, 0, 'linear', this.model.set('isHighlighted', true));
            }
        },

        fall: function() {
            if(this.model.get('isHighlighted')) {
                this.$el.stop(true, true).animate({ bottom: pxToRem(parseFloat(this.$el.css('bottom'))) - this.model.get('highlightDistance') + 'rem'}, 0, 'linear', this.model.set('isHighlighted', false));
            }
        },

        maximize: function() {
        },

        minimize: function() {
        },
    });

    return BubbleView;
});
