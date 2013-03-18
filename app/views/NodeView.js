 define(['jquery', 'underscore', 'backbone', 'vents/InputVent', 'models/Bubble', 'views/BubbleView'], function($, _, Backbone, InputVent, Bubble, BubbleView) {
    var NodeView = Backbone.View.extend({

        className: 'node',

        template: _.template($('#node-template').html()),

        inputVent: InputVent,

        events: {
            'mousedown .front'      : 'handleMousedownFront',

                                    // prevent text select
            'mousedown .back'       : function(event) { event.preventDefault() },

                                    // handle mouse- enter/leave
            'mouseenter .container' : function() { this.bubbleView.rise(); this.inputVent.trigger('mouseenter:nodeFront', { node: this.model }); },
            'mouseleave .container' : function() { this.bubbleView.fall(); this.inputVent.trigger('mouseleave:nodeFront', { node: this.model }); },

                                    // handle clicks
            'click .container'      : function(){ this.bubbleView.handleNodeSelect(); },
            'dblclick .container'   : function(){ this.bubbleView.handleNodeSelect(); }
        },

        initialize: function() {
            _(this).bindAll('render', 'handleMousedownFront', 'center', 'fullCenter');
            var bubble = new Bubble({ parent: this.model });
            this.bubbleView = new BubbleView({ model: bubble });

            this.model.on({
                'change:importance': this.fullCenter,
                'change:type': this.bubbleView.setType
            });
        },

        render: function() {
            this.$el.html(this.template);

            var x = this.model.get('x'),
                y = this.model.get('y');

            this.$el.append(this.bubbleView.$el);
            this.bubbleView.render();

            _.defer(this.center);

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
                $front = this.$('.front');

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

            // call after .front dimensions changes
            $front.css({
                left: '50%',
                top: '50%',
                'margin-left': -1 * pxToRem($front.outerWidth() / 2) + 'rem',
                'margin-top': -1 * pxToRem($front.outerHeight() / 2) + 'rem'
            });

            this.bubbleView.$el.css({
                bottom: pxToRem($back.outerHeight()) * 0.95 + 'rem'
            });

            this.center();
        }

    });

    return NodeView;
});
