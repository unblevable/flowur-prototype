define(['jquery', 'underscore', 'backbone', 'models/Bubble', 'views/BubbleView'], function($, _, Backbone, Bubble, BubbleView) {
    var NodeView = Backbone.View.extend({

        className: 'node',

        template: _.template($('#node-template').html()),

        events: {
            'mouseenter .container, .bubble': 'highlight',
            'mouseleave .container, .bubble': 'unhighlight',
        },

        initialize: function() {
            _(this).bindAll('render', 'highlight', 'unhighlight');
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
            this.bubbleView.trigger('highlight');
        },

        unhighlight: function(event) {
            this.bubbleView.trigger('unhighlight');
        }

    });

    return NodeView;
});
