define(['jquery', 'underscore', 'backbone', 'models/Node', 'views/NodeView'], function($, _, Backbone, Node, NodeView) {
    var InputView = Backbone.View.extend({

        // object of child element (selectors) that are not Backbone Views
        els: {
            container: 'input-container'
        },

        // -------------------------------------------------/ custom properties

        id: 'input',

        template: _.template($('#input-template').html()),

        events: {
        },

        initialize: function() {
            _(this).bindAll('render', 'drawNode');
        },

        render: function() {
            this.$el.html(this.template);
            // initial position for first node
            var w = $(window).width(),
                h = $(window).height(),
                app = this.model.get('parent'),
                ix = w / 4,
                iy = h * (4 / 7);

            this.drawNode(ix, iy);
            this.drawNode(600, 200);
            this.drawNode(800, 400);

            return this;
        },

        drawNode: function(x, y) {
            var node = new Node({
                x: x, y: y
            }),
                nodeView = new NodeView({ model: node });

            this.model.get('nodes').add(node);

            this.$('.input-container').append(nodeView.$el);
            nodeView.render();
        },
    });

    return InputView;
});
