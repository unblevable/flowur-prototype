define(function(require, exports, module) {
    var _           = require('underscore'),
        Backbone    = require('backbone');

    var Arrow = Backbone.Model.extend({

        defaults: {
            // rems
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,

            weight: 1.0,
            weightPx: 16,
            length: 0,

            // px
            x1Px: 0,
            y1Px: 0,

            fromNode: null,
            toNode: null,
            fromNodeType: '',
            toNodeType: '',
            fromNodeHasMaxArrows: false,
            toNodeHasMaxArrows: false,
            isDisabled: false,
            isAttached: false
        },

        initialize: function() {
            _(this).bindAll('erase');
        },

        erase: function() {
            var fromNode = this.get('fromNode'),
                toNode = this.get('toNode');

            fromNode.removeOutArrow(this);
            fromNode.removeToNode(toNode);

            toNode.removeInArrow(this);
            toNode.removeFromNode(fromNode);
        },
    });

    return Arrow;
});
