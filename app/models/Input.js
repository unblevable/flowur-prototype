define(function(require, exports, module) {
    var _           = require('underscore'),
        Backbone    = require('backbone'),
        Nodes       = require('collections/Nodes'),
        Arrows      = require('collections/Arrows'),
        Flowchart   = require('models/Flowchart'),
        FlowchartVent = require('vents/FlowchartVent');

    var Input = Backbone.Model.extend({

        defaults: {
            flowchart: new Flowchart(),

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

            var flowchart = this.get('flowchart');

            flowchart.on({
                'change': function() {
                    if(flowchart) {
                        FlowchartVent.trigger('update:output', flowchart.toJSON());
                    }
                }
            });
        },
    });

    return Input;
});
