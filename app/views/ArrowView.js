define(function(require, exports, module) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        InputVent   = require('vents/InputVent');

    var ArrowView = Backbone.View.extend({

        className: 'arrow',

        inputVent: InputVent,

        events: {
            'click' : function(event) {
                this.model.erase();
                this.destroy();
                this.model.get('fromNode').scaleToImportance();
                this.model.get('toNode').scaleToImportance();
            },
            'mouseenter': function() {
                this.$el.css('opacity', 0.65);
            },
            'mouseleave': function() {
                this.enable();
            }
        },

        initialize: function() {
            _(this).bindAll('render');
            _(this).bindAll('destroy', 'disable', 'enable', 'transform');

            this.inputVent.on({
                'arrowSwitch'       : (function(arrowToSwitch) {
                    if(this.model === arrowToSwitch) this.destroy();
                    arrowToSwitch.erase();
                }).bind(this),

                'change:nodeType'   : (function(node) {
                    var fromNode = this.model.get('fromNode'),
                        toNode = this.model.get('toNode'),
                        classes = this.$el.attr('class').split(/\s+/),
                        fromNodeType,
                        toNodeType;

                    if(this.model.get('isAttached')) {
                        if(this.model.get('fromNode') === node) {
                            fromNodeType = node.get('type');
                            toNodeType = toNode.get('type');
                        } else if (this.model.get('toNode') === node) {
                            fromNodeType = fromNode.get('type');
                            toNodeType = node.get('type');
                        }

                        if(fromNodeType && toNodeType) {
                            _(classes).each((function(klass, index) {
                                // regex would be slower and this check is arguably simpler...
                                // ...remove current class relating to type; assumes class relating to type has a hyphen in it
                                if(klass.indexOf('-') !== -1) {
                                    this.$el.removeClass(klass);
                                    if(fromNodeType === toNodeType) {
                                        this.$el.addClass(fromNodeType + '-arrow');
                                    } else {
                                        this.$el.addClass(fromNodeType + '-' + toNodeType + '-arrow');
                                    }
                                }
                            }).bind(this));
                        }
                    }
                }).bind(this),

                'destroy:node'      : (function(node) {
                    // super sloppy; needs cleanup and basic speed-up
                    var fromNode = this.model.get('fromNode'),
                        toNode = this.model.get('toNode'),
                        nodeToDestroy;

                    if(fromNode === node) {
                        nodeToDestroy = fromNode;
                        nodeToDestroy.removeOutArrow(this.model);
                    } else if (toNode === node) {
                        nodeToDestroy = toNode;
                        nodeToDestroy.removeInArrow(this.model);
                    }

                    if(nodeToDestroy) {
                        var fromNodes = nodeToDestroy.get('fromNodes'),
                            toNodes = nodeToDestroy.get('toNodes');

                        _(fromNodes).each((function(node, index) {
                            node.removeToNode(nodeToDestroy);
                            node.removeOutArrow(this.model);
                            node.scaleToImportance();
                            nodeToDestroy.removeToNode(node);
                        }).bind(this));

                        _(toNodes).each((function(node, index) {
                            node.removeFromNode(nodeToDestroy);
                            node.removeInArrow(this.model);
                            node.scaleToImportance();
                            nodeToDestroy.removeFromNode(node);
                        }).bind(this));

                        this.model.erase();
                        this.destroy();
                    }

                }).bind(this),

                'drag:node'     : (function(position, node) {
                    var fromNode = this.model.get('fromNode'),
                        toNode = this.model.get('toNode');

                    if(fromNode === node || toNode == node) {
                        var weight = this.model.get('weight'),
                            nodeWidth = pxToRem(node.get('view').$el.outerWidth()),
                            nodeHeight = pxToRem(node.get('view').$el.outerHeight()),
                            positionLeft = pxToRem(position.left),
                            positionTop = pxToRem(position.top);

                        node.set('isDragging', true);
                    }

                    if(fromNode === node) {
                        this.model.set('x1', positionLeft);
                        this.model.set('y1', positionTop);
                        this.$el.css({
                            left: this.model.get('x1') + nodeWidth / 2 + 'rem',
                            top: this.model.get('y1') + nodeHeight / 2 - weight / 2 + 'rem'
                        });
                        fromNode.set('x', this.model.get('x1') + nodeWidth / 2);
                        fromNode.set('y', this.model.get('y1') + nodeHeight / 2);
                    } else if (toNode === node) {
                        this.model.set('x2', positionLeft);
                        this.model.set('y2', positionTop);
                        toNode.set('x', this.model.get('x2') + nodeWidth / 2);
                        toNode.set('y', this.model.get('y2') + nodeHeight / 2);
                    }

                    // isAttached prevents zombie arrows from listening to event
                    if(this.model.get('isAttached') && (fromNode === node || toNode === node)) {
                        this.transform({
                            x1: fromNode.get('x'),
                            y1: fromNode.get('y'),
                            x2: toNode.get('x'),
                            y2: toNode.get('y')
                        });
                    }
                }).bind(this),
            });
        },

        render: function() {
            var weight = this.model.get('weight');

            this.$el.css({
                left: this.model.get('x1') + 'rem',
                top: this.model.get('y1') - weight / 2  + 'rem'
            });

            this.enable();

            return this;
        },

        destroy: function(callback) {
            this.model.destroy();

            this.stopListening(this.model);
            this.stopListening(this.inputVent);
            this.undelegateEvents();

            this.remove();

            if(typeof(callback) !== 'undefined') {
                if(_(callback).isFunction) callback.call(this);
            }
        },

        disable: function() {
            this.$el.css({
                opacity: 0.3
            });
        },

        enable: function() {
            this.$el.css({
                opacity: 1.0
            });
        },

        transform: function(coords, usePx) {
            var x1 = coords.x1,
                x2 = coords.x2,
                y1 = coords.y1,
                y2 = coords.y2,

                // distance formula
                length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)),

                // angle for rotation
                angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI,
                transform = 'rotate(' + angle + 'deg)',
                units;

            if(arguments.length == 2) {
                units = (usePx === true) ? 'px' : 'rem'
            } else {
                units = 'rem'
            }

            // css width translates to the length of the arrow (css height translates to the weight of the arrow)
            this.$el.css({
                width: length + units,
                '-webkit-transform': transform,
                '-moz-transform': transform,
                '-ms-transform': transform,
                '-o-transform': transform,
                transform: transform,
            });

            this.$('.container').css({
                width: length + units,
            });

            // store to model

            if(units === 'px') {
                length = pxToRem(length);
                x1 = pxToRem(x1);
                x2 = pxToRem(x2);
                y1 = pxToRem(y1);
                y2 = pxToRem(y2);
            }

            this.model.set({
                x1: x1,
                x2: x2,
                y1: y1,
                y2: y2,
                length: length
            });
        },

        changeColor: function() {
        }
    });

    return ArrowView;
});
