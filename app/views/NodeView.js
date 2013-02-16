define(['jquery', 'underscore', 'backbone', 'models/Bubble', 'views/BubbleView'], function($, _, Backbone, Bubble, BubbleView) {
    var NodeView = Backbone.View.extend({

        className: 'node',

        template: _.template($('#node-template').html()),

        events: {
            'mouseenter .container': 'highlight',
            'mouseleave .container': 'unhighlight',
            'click .container': function(){
                this.bubbleView.trigger('nodeSelect');
            },
            'dblclick .container': function(){
                this.bubbleView.trigger('nodeSelect');
            }
        },

        initialize: function() {
            _(this).bindAll('render');
            var bubble = new Bubble({ parent: this.model });
            this.bubbleView = new BubbleView({ model: bubble });
        },

        render: function() {
            this.$el.html(this.template);

            var x = this.model.get('x'),
                y = this.model.get('y');

            // center node on x and y coordinate
            this.$el.css({
                left: x - this.$el.innerWidth() / 2,
                top: y - this.$el.innerHeight() / 2
            });

            this.$el.append(this.bubbleView.$el);
            this.bubbleView.render();

            return this;
        },

        // event listeners ----------------------------------------------------

        highlight: function(event) {
            this.bubbleView.trigger('nodeHighlight');
        },

        unhighlight: function() {
            this.bubbleView.trigger('nodeUnhighlight');
        }

    });

    return NodeView;
});
