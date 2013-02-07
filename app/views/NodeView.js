define(['jquery', 'underscore', 'backbone', 'models/Node'], function($, underscore, backbone, Node) {
    var NodeView = Backbone.View.extend({
        template: _.template($('#text').html()),

        initialize: function() {
            _.bindAll(this, 'render');
        },

        render: function() {
            this.$el.html(this.template());
            return this.$el;
        }

    });

    return NodeView;
});
