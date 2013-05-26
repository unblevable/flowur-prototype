define(function(require, exports, module) {
    var _           = require('underscore'),
        Backbone    = require('backbone'),
        Nodes       = require('collections/Nodes'),
        Arrows      = require('collections/Arrows');

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

            // startNodeX: 30,
            startNodeX: 30,
            startNodeY: 12,

            // scroll positions
            scrollX: 0,
            scrollY: 0
        },

        initialize: function() {
        },
    });

    return Input;
});
