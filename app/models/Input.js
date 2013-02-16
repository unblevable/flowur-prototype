define(['jquery', 'underscore', 'backbone', 'collections/Nodes'], function($, _, Backbone, Nodes) {
    var Input = Backbone.Model.extend({

        defaults: {
            parent: null,
            css: null,
            nodes: new Nodes(),
            arrows: null,
            selectedNodes: null,
        },

        initialize: function() {
        }
    });

    return Input;
});
