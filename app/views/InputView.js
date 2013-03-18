define(['jquery', 'underscore', 'backbone', 'vents/InputVent', 'models/Arrow', 'models/InputOptions', 'models/Node', 'views/ArrowView', 'views/InputOptionsView', 'views/NodeView'], function($, _, Backbone, InputVent, Arrow,  InputOptions, Node, ArrowView, InputOptionsView, NodeView) {
    var InputView = Backbone.View.extend({

        id: 'input',

        template: _.template($('#input-template').html()),

        inputVent: InputVent,

        // jQuery selection objects for later use
        $els: null,

        events: {
            'mousemove'             : 'handleArrowDrag',
            'mouseup'               : 'handleArrowAttachment',
            'click .options-toggle' : 'toggleOptionsToggle'
        },

        initialize: function() {
            _(this).bindAll('render', 'handleArrowDrag', 'handleArrowAttachment', 'toggleOptionsToggle');
            _(this).bindAll('activateOptionsToggle', 'deactivateOptionsToggle', 'startArrowDrag', 'handleArrowEnterToNode', 'handleArrowLeaveToNode');
            _(this).bindAll('attachNode');

            this.optionsView = new InputOptionsView({ model: new InputOptions });

            this.inputVent.on({
                'mousedown:nodeFront'       : this.startArrowDrag,
                'mouseenter:nodeFront'      : this.handleArrowEnterToNode,
                'mouseleave:nodeFront'      : this.handleArrowLeaveToNode,
                'activate:optionsToggle'    : this.activateOptionsToggle,
                'deactivate:optionsToggle'  : this.deactivateOptionsToggle,
                'showNodeOptions'           : this.activateOptionsToggle,
            });
        },

        render: function() {
            this.$el.html(this.template);

            this.$els = {
                optionsToggle: this.$('.options-toggle'),
                container: this.$('#input-container')
            };

            this.activateOptionsToggle();

            this.$el.append(this.optionsView.$el);
            this.optionsView.render();

            this.attachNode(this.model.get('startNodeX'), this.model.get('startNodeY'));

            return this;
        },

        // dom event handlers -------------------------------------------------

        // mousemouse event handler, so performance is crucial
        handleArrowDrag: function(event) {
            if(this.model.get('isArrowDragging')) {
                var proxyArrowView = this.proxyArrowView,
                    proxyArrow = proxyArrowView.model;

                proxyArrowView.transform({

                    // stick with px for these calculations for speed
                    x1: proxyArrow.get('x1Px'),
                    y1: proxyArrow.get('y1Px'),
                    x2: event.pageX,
                    y2: event.pageY
                }, true);

                if(proxyArrow.get('toNodeHasMaxArrows')
                    || proxyArrow.get('fromNodeHasMaxArrows')
                    || this.model.get('isRepeatConnection')
                    || proxyArrow.get('toNode') === proxyArrow.get('fromNode')
                    || proxyArrow.get('length') < this.model.get('minimumDragDistance') && !proxyArrow.has('toNode')) {

                    proxyArrowView.disable();
                    this.model.set('canAttachArrow', false);
                } else {

                    proxyArrowView.enable();
                    this.model.set('canAttachArrow', true);
                }
            }
        },

        handleArrowAttachment: function(event) {
            if(this.model.get('isArrowDragging')) {

                var proxyArrowView = this.proxyArrowView,
                    proxyArrow = proxyArrowView.model,
                    toNode = proxyArrow.get('toNode'),
                        fromNode = proxyArrow.get('fromNode');

                if(this.model.get('canAttachArrow')) {

                    // if the mouse is over a target node that is not the same as the source node
                    if(proxyArrow.has('toNode') && toNode !== fromNode) {

                        var toNodeArrows = toNode.get('arrows'),
                            fromNodeArrows = fromNode.get('arrows'),
                            maxArrowsPerNode = this.model.get('maxArrowsPerNode');

                        // if nodes are already connected in the opposite direction
                        if (_(fromNode.get('fromNodes')).contains(toNode)) {

                            // destroy the existing arrow
                            _(fromNode.get('inArrows')).each(function(arrow) {
                                if(arrow.get('fromNode') === toNode) {
                                    this.inputVent.trigger('arrowSwitch', arrow);
                                }
                            }.bind(this));
                        }

                    // else mouse is somewhere on the canvas
                    } else {

                        var fromNodeType = fromNode.get('type'),
                            toNodeType = '';

                        // set type of toNode
                        if(fromNodeType === 'question') {
                            toNodeType = 'answer';
                        } else if (fromNodeType === 'answer' || fromNodeType === 'statement') {
                            toNodeType = 'question';
                        }

                        var newNode = this.attachNode(pxToRem(event.pageX), pxToRem(event.pageY), { type: toNodeType });
                        proxyArrow.set('toNode', newNode);
                    }

                    this.attachProxyArrow();

                } else {

                    proxyArrowView.destroy();
                }

            }

            // reset
            this.model.set('isArrowDragging', false);
            this.model.set('fromNodeHasMaxArrows', false);
            this.model.set('toNodeHasMaxArrows', false);
            this.model.set('isRepeatConnection', false);
            this.model.set('isArrowLongEnough', false);
            this.model.set('canAttachArrow', false);
        },

        toggleOptionsToggle: function() {
            if(this.model.get('isOptionsToggleActive')) {
                this.deactivateOptionsToggle();
                this.inputVent.trigger('hide:options');
            } else {
                this.activateOptionsToggle();
                this.inputVent.trigger('show:options');
            }
        },


        // cross-view event handlers ------------------------------------------

        startArrowDrag: function(options) {
            if(!this.model.get('isArrowDragging')) {
                this.model.set('isArrowDragging', true);

                this.proxyArrowView = new ArrowView({
                    model: new Arrow({
                        x1: options.x,
                        y1: options.y,
                        x1Px: remToPx(options.x),
                        y1Px: remToPx(options.y),
                    })
                });

                var proxyArrowView = this.proxyArrowView,
                    proxyArrow = proxyArrowView.model;

                proxyArrow.set('fromNode', options.node);

                var fromNode = proxyArrow.get('fromNode');

                if(fromNode.get('arrows').length >= this.model.get('maxArrowsPerNode')) proxyArrow.set('fromNodeHasMaxArrows', true);

                this.$els.container.append(proxyArrowView.render().$el);

                proxyArrowView.$el.addClass(fromNode.get('type') + '-arrow');
            }
        },

        handleArrowEnterToNode: function(options) {
            if(this.model.get('isArrowDragging')) {
                var proxyArrowView = this.proxyArrowView,
                    proxyArrow = proxyArrowView.model;

                proxyArrow.set('toNode', options.node);
                var toNode = proxyArrow.get('toNode');

                // if the target node has reached its arrow limit
                if(toNode.get('arrows') >= this.model.get('maxArrowsPerNode')) proxyArrow.set('toNodeHasMaxArrows', true);

                // if the source node already connects to the target node
                if(_(proxyArrow.get('fromNode').get('toNodes')).contains(toNode)) this.model.set('isRepeatConnection', true);
            }
        },

        handleArrowLeaveToNode: function(options) {
            if(this.model.get('isArrowDragging')) {
                var proxyArrowView = this.proxyArrowView,
                    proxyArrow = proxyArrowView.model;

                // reset flags set by handleArrowEnterNode()
                proxyArrow.set('toNodeHasMaxArrows', false);
                this.model.set('isRepeatConnection', false);

                proxyArrow.set('toNode', null);
            }
        },

        activateOptionsToggle: function() {
            var optionsToggle = this.$els.optionsToggle;

            if(optionsToggle.hasClass('options-toggle-inactive')) optionsToggle.removeClass('options-toggle-inactive');
            this.$els.optionsToggle.addClass('options-toggle-active');

            this.model.set('isOptionsToggleActive', true);
        },

        deactivateOptionsToggle: function() {
            var optionsToggle = this.$els.optionsToggle;

            if(optionsToggle.hasClass('options-toggle-active')) optionsToggle.removeClass('options-toggle-active');
            optionsToggle.addClass('options-toggle-inactive');

            this.model.set('isOptionsToggleActive', false);
        },

        // other methods ------------------------------------------------------

        attachNode: function(x, y, options) {
            if(typeof options === 'undefined') options = {};

            var node = new Node({
                x: x, y: y
            }, options),
                nodeView = new NodeView({ model: node });

            this.model.get('nodes').add(node);

            this.$els.container.append(nodeView.$el);
            nodeView.render();

            return node;
        },

        // assumes proxy arrow exists, and proxy arrow from and to nodes exist
        attachProxyArrow: function() {
            var proxyArrowView = this.proxyArrowView,
                proxyArrow = proxyArrowView.model,
                fromNode = proxyArrow.get('fromNode'),
                toNode = proxyArrow.get('toNode'),
                fromNodeType = fromNode.get('type'),
                toNodeType =  toNode.get('type');

            if(fromNodeType !== toNodeType) {
                // proxyArrowView.$('.arrow-container').removeClass(fromNodeType + '-arrow');
                // proxyArrowView.$('.arrow-container').addClass(fromNodeType + '-' + toNodeType + '-arrow');
                proxyArrowView.$el.removeClass(fromNodeType + '-arrow');
                proxyArrowView.$el.addClass(fromNodeType + '-' + toNodeType + '-arrow');
            }

            proxyArrowView.transform({
                x1: proxyArrow.get('x1'),
                y1: proxyArrow.get('y1'),
                x2: toNode.get('x'),
                y2: toNode.get('y')
            }, false);

            // update nodes on either end of the arrow
            toNode.addInArrow(proxyArrow);
            fromNode.addOutArrow(proxyArrow);

            toNode.addFromNode(fromNode);
            fromNode.addToNode(toNode);

        },
    });

    return InputView;
});
