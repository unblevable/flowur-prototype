define(['jquery', 'underscore', 'backbone', 'models/Input', 'views/InputView'], function($, _, Backbone, Input, InputView) {
    var AppView = Backbone.View.extend({

        id: 'application',

        events: {
        },

        initialize: function() {
            _(this).bindAll('render', 'adjustSize');

            this.inputView = new InputView({ model: new Input({ parent: this.model }) });

            // window events cannot be handled normally by Backbone Views
            $(window).on('resize', _(function() {
                this.adjustSize(this.inputView.$el);
            }).bind(this));
        },

        render: function() {
            this.$el.append(this.inputView.$el);
            this.adjustSize(this.inputView.$el);
            this.inputView.render();

            return this;
        },

        // non-Backbone methods -----------------------------------------------

        adjustSize: function(viewElement) {
            viewElement.css('width', $(window).width());
            viewElement.css('height', $(window).height());
        }
    });

    return AppView;
});
