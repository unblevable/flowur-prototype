define(['jquery', 'underscore', 'backbone', 'collections/Nodes'], function($, _, Backbone, Nodes) {
    var Input = Backbone.Model.extend({

        defaults: {
            parent: null,
            css: null,
            nodes: new Nodes()
        },

        initialize: function() {
        }
    });

    return Input;
});
