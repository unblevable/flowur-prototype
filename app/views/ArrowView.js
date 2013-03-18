define(['jquery', 'underscore', 'backbone', 'vents/InputVent'], function($, _, Backbone, InputVent) {
    var ArrowView = Backbone.View.extend({

        className: 'arrow',

        template: _.template($('#arrow-template').html()),

        inputVent: InputVent,

        initialize: function() {
            _(this).bindAll('render');
            _(this).bindAll('destroy', 'disable', 'enable', 'transform');

            this.inputVent.on('arrowSwitch', function(arrowToSwitch) {
                if(this.model === arrowToSwitch) this.destroy();
                arrowToSwitch.erase();
            }.bind(this));

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
