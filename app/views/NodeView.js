 define(['jquery', 'underscore', 'backbone', 'vents/InputVent', 'models/Bubble', 'views/BubbleView'], function($, _, Backbone, InputVent, Bubble, BubbleView) {
    var NodeView = Backbone.View.extend({

        className: 'node',

        template: _.template($('#node-template').html()),

        inputVent: InputVent,

        events: {
            'mousedown .front'      : function(event) {
                // prevent text select
                event.preventDefault();
                this.inputVent.trigger('mousedown:nodeFront', {
                    x: this.model.get('x'),
                    y: this.model.get('y'),
                    node: this.model
                });
            },

            // prevent text select
            'mousedown .back'       : function(event) { event.preventDefault() },
            // 'mouseenter .container' : function() { this.bubbleView.rise() },
            // 'mouseleave .container' : function() { this.bubbleView.fall() },
            'mouseenter .container' : function() { this.bubbleView.rise(); this.inputVent.trigger('mouseenter:nodeFront', { node: this.model }); },
            'mouseleave .container' : function() { this.bubbleView.fall(); this.inputVent.trigger('mouseleave:nodeFront', {node: this.model }); },

            // for when a user tries to place node on another node's border
            'click .container'      : function(){ this.bubbleView.handleNodeSelect(); },
            'dblclick .container'   : function(){ this.bubbleView.handleNodeSelect(); }
        },

        initialize: function() {
            _(this).bindAll('render', 'transparentize', 'center', 'recenter');
            var bubble = new Bubble({ parent: this.model });
            this.bubbleView = new BubbleView({ model: bubble });

            this.model.on({
                'change:importance': this.recenter,
                'change:type': this.bubbleView.setType
            });
        },

        render: function() {
            this.$el.html(this.template);

            var x = this.model.get('x'),
                y = this.model.get('y');

            this.$el.append(this.bubbleView.$el);
            this.bubbleView.render();

            // center node on x and y coordinate
            this.$el.css({
                left: (this.model.get('x') - this.model.get('baseBackSize') / 2) + 'rem',
                top: (this.model.get('y') - this.model.get('baseBackSize') / 2) + 'rem'
            });

            return this;
        },

        transparentize: function() {
            console.log('whoa');
        },

        center: function() {
            this.$el.css({
                left: (this.model.get('x') - pxToRem(this.$('.container').outerWidth()) / 2) + 'rem',
                top: (this.model.get('y') - pxToRem(this.$('.container').outerHeight()) / 2) + 'rem'
            });
        },

        recenter: function() {
            this.$el.css({
                width: this.model.get('importance') * this.model.get('baseBackSize') + 'rem',
                height: this.model.get('importance') * this.model.get('baseBackSize') + 'rem'
            });
            this.$('.back, .container').css({
                width: this.model.get('importance') * this.model.get('baseBackSize') + 'rem',
                height: this.model.get('importance') * this.model.get('baseBackSize') + 'rem'
            });
            this.$('.back').css({
                left: '50%',
                top: '50%',
                'margin-left': -1 * pxToRem(this.$('.back').outerWidth() / 2) + 'rem',
                'margin-top': -1 * pxToRem(this.$('.back').outerHeight() / 2) + 'rem'
            });
            this.$('.front').css({
                width: this.model.get('importance') * this.model.get('baseFrontSize') + 'rem',
                height: this.model.get('importance') * this.model.get('baseFrontSize') + 'rem'
            });
            this.$('.front').css({
                left: '50%',
                top: '50%',
                'margin-left': -1 * pxToRem(this.$('.front').outerWidth() / 2) + 'rem',
                'margin-top': -1 * pxToRem(this.$('.front').outerHeight() / 2) + 'rem'
            });
            this.bubbleView.$el.css({
                bottom: pxToRem(this.$('.back').outerHeight()) * 0.95 + 'rem'
            });
            this.center();
        }

    });

    return NodeView;
});
