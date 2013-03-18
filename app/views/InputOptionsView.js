define(['jquery', 'underscore', 'backbone', 'vents/InputVent', 'models/NodeOptions', 'views/NodeOptionsView', 'jqueryui'], function($, _, Backbone, InputVent, NodeOptions, NodeOptionsView) {
    var InputOptionsView = Backbone.View.extend({

        id: 'input-options',

        className: 'clearfix',

        template: _.template($('#input-options-template').html()),

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
