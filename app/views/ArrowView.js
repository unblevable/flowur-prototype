define(['jquery', 'underscore', 'backbone', 'vents/InputVent'], function($, _, Backbone, InputVent) {
    var ArrowView = Backbone.View.extend({

        className: 'arrow',

        template: _.template($('#arrow-template').html()),

        inputVent: InputVent,

        events: {
            'click' : function(event) {
                this.model.erase();
                this.destroy();
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

                }).bind(this)
            });

            this.model.on({
                'change:x1 change:y1': function() {
                    this.model.set('x1Px', this.model.get('x1'));
                    this.model.set('y1Px', this.model.get('y1'));
                }.bind(this)
            });
        },

        render: function() {
            this.$el.html(this.template);

            this.$el.css({
                top: (this.model.get('y1') - this.model.get('weight')) + 'rem',
                left: this.model.get('x1') + 'rem'
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
