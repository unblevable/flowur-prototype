define(['jquery', 'underscore', 'backbone', 'models/Node'], function($, _, Backbone, Node) {
    var Nodes = Backbone.Collection.extend({

        model: Node
    });

    return Nodes;
});
