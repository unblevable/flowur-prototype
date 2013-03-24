define(['jquery', 'underscore', 'backbone', 'collections/Nodes', 'collections/Arrows'], function($, _, Backbone, Nodes, Arrows) {
    var Input = Backbone.Model.extend({

        defaults: {
            parent: null,
            css: null,
            nodes: new Nodes(),
            arrows: new Arrows(),
            selectedNodes: null,

            isOptionsToggleActive: true,
            zoom: 100,

            minimumDragDistance: 10.0,
            maxArrowsPerNode: 12,

            isDraggingArrow: false,
            fromNodeHasMaxArrows: false,
            toNodeHasMaxArrows: false,
            isRepeatConnection: false,
            isArrowLongEnough: false,
            canAttachArrow: false,

            startNodeX: 30,
            startNodeY: 12,
        },

        initialize: function() {
        },
    });

    return Input;
});
