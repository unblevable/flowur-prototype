define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Node = Backbone.Model.extend({

        defaults: {
            x: 0,
            y: 0,
            type: 'question',
            importance: 1.0,
            isEditingOptions: false,
            isImportanceUserSet: false,

            // rem
            baseBackSize: 8.4,
            baseFrontSize: 5.4,
            baseShadow: {
                offsetY: 0.375,
                blurRadius: 0.625,
                spreadRadius: 0.125
            },

            // keep references to both arrows and nodes for speed
            outArrows: null,                        // arrows that point away from the node
            inArrows:null,                          // arrows that point toward the node
            // array of all arrows for convenience
            arrows: null,

            fromNodes: null,                        // nodes that connect forward to the node
            toNodes: null,                          // nodes that the node connects (forward) to
            // could be used for a fancy highlight effect
            nodes: null,

            isLastNode: true
        },

        initialize: function(attributes, options) {
            _(this).bindAll('addOutArrow', 'addInArrow', 'addArrow', 'addFromNode', 'addToNode', 'addNode', 'setAsArray');

            this.setAsArray('outArrows', 'inArrows', 'arrows', 'fromNodes', 'toNodes', 'nodes');

            if(typeof options.type !== 'undefined') {
                this.set('type', options.type);
            }
            if(typeof options.importance !== 'undefined') {
                this.set('importance', options.importance);
            }
        },


        addOutArrow: function(arrow) {
            this.get('outArrows').push(arrow);
            this.trigger('change:outArrows');

            this.addArrow(arrow);
        },

        addInArrow: function(arrow) {
            this.get('inArrows').push(arrow);
            this.trigger('change:inArrows');

            this.addArrow(arrow);
        },

        addArrow: function(arrow) {
            this.get('arrows').push(arrow);
            this.trigger('change:arrows');
            this.trigger('change');
        },

        removeOutArrow: function(arrowToDelete) {
            var outArrows = this.get('outArrows');
            _(outArrows).each(function(arrow, index) {
                if(arrow === arrowToDelete) outArrows.splice(index, 1);
            }.bind(this));

            this.removeArrow(arrowToDelete);
        },

        removeInArrow: function(arrowToDelete) {
            var inArrows = this.get('outArrows');
            _(inArrows).each(function(arrow, index) {
                if(arrow === arrowToDelete) inArrows.splice(index, 1);
            }.bind(this));

            this.removeArrow(arrowToDelete);
        },

        removeArrow: function(arrowToDelete) {
            var arrows = this.get('arrows');
            _(arrows).each(function(arrow, index) {
                if(arrow === arrowToDelete) arrows.splice(index, 1);
            }.bind(this));
        },

        addFromNode: function(node) {
            this.get('fromNodes').push(node);
            this.trigger('change:fromNodes');
            this.addNode(node);
        },

        addToNode: function(node) {
            this.get('toNodes').push(node);
            this.trigger('change:toNodes');
            this.addNode(node);
        },

        addNode: function(node) {
            this.get('nodes').push(node);
            this.trigger('change:nodes');
            this.trigger('change');
        },

        removeFromNode: function(nodeToDelete) {
            var fromNodes = this.get('fromNodes');
            _(fromNodes).each(function(node, index) {
                if(node === nodeToDelete) fromNodes.splice(index, 1);
            }.bind(this));

            this.removeNode(nodeToDelete);
        },

        removeToNode: function(nodeToDelete) {
            var toNodes = this.get('toNodes');
            _(toNodes).each(function(node, index) {
                if(node === nodeToDelete) toNodes.splice(index, 1);
            }.bind(this));

            this.removeNode(nodeToDelete);
        },

        removeNode: function(nodeToDelete) {
            var nodes = this.get('nodes');
            _(nodes).each(function(node, index) {
                if(node === nodeToDelete) nodes.splice(index, 1);
            }.bind(this));
        },

        setAsArray: function() {
            _(arguments).each(function(argument, index) {
                if(_(argument).isString()) {
                    if(!this.get(argument)) this.set(argument, []);
                }
            }.bind(this));
        },

        scaleToImportance: function() {
            var type = this.get('type');
            if(type === 'question' || type === 'statement') {
                var numArrows = this.get('outArrows').length;

                if(numArrows < 3) {
                    this.set('importance', 1.0);
                } else if(numArrows >= 3 && numArrows < 5) {
                    this.set('importance', 1.25);
                } else if (numArrows >= 5) {
                    this.set('importance', 1.50);
                }
            }
        }

        // non-Backbone methods -----------------------------------------------
    });

    return Node;
});
