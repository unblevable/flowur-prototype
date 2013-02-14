define(['jquery', 'underscore', 'backbone', 'models/Node', 'views/NodeView'], function($, _, Backbone, Node, NodeView) {
    var InputView = Backbone.View.extend({

        // object of child element (selectors) that are not Backbone Views
        els: {
            container: '.container'
        },

        // -------------------------------------------------/ custom properties

        id: 'input',

        template: _.template($('#input-template').html()),

        events: {
            'mousedown': 'zoom',
            'mouseup': 'zoomOut'
        },

        initialize: function() {
            _(this).bindAll('render', 'drawNode', 'zoom', 'zoomOut');
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

            return this;
        },

        drawNode: function(x, y) {
            var node = new Node({
                x: x, y: y
            }),
                nodeView = new NodeView({ model: node });

            this.model.get('nodes').add(node);

            this.$(this.els.container).append(nodeView.$el);
            nodeView.render();
        },

        zoom: function() {
            // this.$(this.els.container).css('-moz-transform', 'scale(0.65)');
        },

        zoomOut: function() {
            // this.$(this.els.container).css('-moz-transform', 'scale(1.0)');
        }
    });

    return InputView;
});
