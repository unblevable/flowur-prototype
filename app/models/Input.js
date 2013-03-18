define(['jquery', 'underscore', 'backbone', 'collections/Nodes'], function($, _, Backbone, Nodes) {
    var Input = Backbone.Model.extend({

        defaults: {
            parent: null,
            css: null,
            nodes: new Nodes(),
            arrows: null,
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
