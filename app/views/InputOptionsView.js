define(function(require, exports, module) {
    var $                       = require('jquery-ui'),
        _                       = require('underscore'),
        Backbone                = require('backbone'),
        InputVent               = require('vents/InputVent'),
        NodeOptions             = require('models/NodeOptions'),
        NodeOptionsView         = require('views/NodeOptionsView');
        InputOptionsTemplate    = require('text!templates/input_options.html');

    var InputOptionsView = Backbone.View.extend({

        id: 'input-options',

        className: 'clearfix',

        template: _.template(InputOptionsTemplate),

        // custom properties --------------------------------------------------
        inputVent: InputVent,

        events: {
            'focus .title': function(event) { $(event.target).select() }
        },

        initialize: function() {
            _(this).bindAll('render', 'renderZoom', 'show', 'hide');

            var nodeOptions = new NodeOptions;
            this.nodeOptionsView = new NodeOptionsView({ model: nodeOptions });

            // model-change events
            this.model.on({
                'change:zoom': this.renderZoom
            });

            this.inputVent.on({
                'show:options'      : this.show,
                'hide:options'      : this.hide,
                'showNodeOptions'   : this.show,
                'addOrRemove:node'      : (function(lastNode, length) {
                    this.$('.node-count strong').text(length);
                }).bind(this),
                'addOrRemove:arrow' : (function(length) {
                    this.$('.arrow-count strong').text(length);
                }).bind(this)
            });
        },

        render: function() {
            this.$el.html(this.template);

            this.zoomSlider = this.$('#zoom-slider').slider({

                // percentages
                max: 250,
                min: 25,
                value: this.model.get('zoom'),
                range: 'min',

                slide: function(event, ui) {
                    this.model.set('zoom', ui.value);
                    this.inputVent.trigger('slide:zoomSlider', ui.value);
                }.bind(this)
            });

            this.renderZoom();

            this.$('#stats-options').append(this.nodeOptionsView.$el);
            this.nodeOptionsView.$el.hide();
            this.nodeOptionsView.render();

            return this;
        },

        renderZoom: function() {
            this.$('#view-options > .value').text(this.model.get('zoom') + '%');
        },

        // cross-view event handlers ------------------------------------------

        show: function() {
            this.$el.show();
        },

        hide: function() {
            this.$el.hide();
        }
    });

    return InputOptionsView;
});
