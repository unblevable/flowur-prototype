define(function(require, exports, module) {
    var $               = require('jquery'),
        _               = require('underscore'),
        Backbone        = require('backbone'),
        InputVent       = require('vents/InputVent'),
        Bubble          = require('models/Bubble'),
        BubbleView      = require('views/BubbleView');
        NodeTemplate    = require('text!templates/node.html');

    var NodeView = Backbone.View.extend({

        className: 'node',

        template: _.template(NodeTemplate),

        inputVent: InputVent,

        events: {
            'mousedown'             : function(event) { event.stopPropagation(); },
            'mousedown .front'      : 'handleMousedownFront',

                                    // prevent text select
            'mousedown .back'       : function(event) { event.preventDefault() },

                                    // handle mouse- enter/leave
            'mouseenter .container' : function() { this.bubbleView.rise(); this.inputVent.trigger('mouseenter:nodeFront', { node: this.model }); },
            'mouseleave .container' : function() { this.bubbleView.fall(); this.inputVent.trigger('mouseleave:nodeFront', { node: this.model }); },

                                    // handle clicks
            'click .container'      : function(){ if(!this.model.get('isDragging')) this.bubbleView.handleNodeSelect();},
            'dblclick .container'   : function(){ this.bubbleView.handleNodeSelect(); },
        },

        initialize: function() {
            _(this).bindAll('render', 'handleMousedownFront', 'center', 'fullCenter', 'destroy');

            var bubble = new Bubble({ parent: this.model });
            this.bubbleView = new BubbleView({ model: bubble });

            this.model.on({
                'change:importance': (function() {
                    this.fullCenter();
                    this.inputVent.trigger('change:nodeImportance', this.model.get('importance'));
                }).bind(this),
                'change:type': (function(model, type) {
                    this.bubbleView.setType(model, type);

                    // trigger arrows to change color
                    this.inputVent.trigger('change:nodeType', model);
                }).bind(this)
            });

            this.inputVent.on({
                'destroy:bubble': (function(bubbleView) {
                    if(this.bubbleView === bubbleView) {
                        this.destroy();
                    }
                }).bind(this),
            });
        },

        render: function() {
            this.$el.html(this.template);

            var x = this.model.get('x'),
                y = this.model.get('y');

            this.$el.append(this.bubbleView.$el);
            this.bubbleView.render();

            _.defer(this.center);
            _.defer(this.fullCenter);

            return this;
        },

        // event handlers -----------------------------------------------------

        handleMousedownFront: function(event) {
            // prevent text select
            event.preventDefault();
            this.inputVent.trigger('mousedown:nodeFront', {
                x: this.model.get('x'),
                y: this.model.get('y'),
                node: this.model
            });
        },

        // other methods ------------------------------------------------------

        center: function() {
            var $container = this.$('.container');

            this.$el.css({
                left: (this.model.get('x') - pxToRem($container.outerWidth()) / 2) + 'rem',
                top: (this.model.get('y') - pxToRem($container.outerHeight()) / 2) + 'rem'
            });
        },

        // center the node and all children dom elements after dimension/position changes have been made
        fullCenter: function() {
            var importance = this.model.get('importance'),
                baseBackSize = this.model.get('baseBackSize'),
                baseFrontSize = this.model.get('baseFrontSize'),
                $back = this.$('.back'),
                $front = this.$('.front'),
                baseShadow = this.model.get('baseShadow');

            this.$el.css({
                width: importance * baseBackSize + 'rem',
                height: importance * baseBackSize + 'rem'
            });
            this.$('.back, .container').css({
                width: importance * baseBackSize + 'rem',
                height: importance * baseBackSize + 'rem'
            });

            $back.css({
                left: '50%',
                top: '50%',
                'margin-left': -1 * pxToRem($back.outerWidth() / 2) + 'rem',
                'margin-top': -1 * pxToRem($back.outerHeight() / 2) + 'rem'
            });

            $front.css({
                width: importance * baseFrontSize + 'rem',
                height: importance * baseFrontSize + 'rem',
            });

            // call after .front dimensions change
            $front.css({
                left: '50%',
                top: '50%',
                'margin-left': -1 * pxToRem($front.outerWidth() / 2) + 'rem',
                'margin-top': -1 * pxToRem($front.outerHeight() / 2) + 'rem',
                'box-shadow': '0 ' + (pxToRem($front.width()) * (baseShadow.offsetY / baseFrontSize)) + 'rem ' + (pxToRem($front.width()) * (baseShadow.blurRadius / baseFrontSize)) + 'rem ' + (pxToRem($front.width()) * (baseShadow.spreadRadius / baseFrontSize)) + 'rem rgba(0, 0, 0, 0.13)'
            });

            this.bubbleView.$el.css({
                bottom: pxToRem($back.outerHeight()) * 0.95 + 'rem'
            });

            this.center();
        },

        // Potential bug: order of removals.
        destroy: function() {
            this.inputVent.trigger('removeNode:flowchart', this.model.cid.replace( /^\D+/g, ''));

            this.stopListening(this.model);
            this.model.destroy();

            this.stopListening(this.inputVent);

            this.undelegateEvents();
            this.remove();

            this.inputVent.trigger('destroy:node', this.model);
            this.inputVent.trigger('delete:node', this.model);
        }
    });

    return NodeView;
});
