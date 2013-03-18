define(['jquery', 'underscore', 'backbone', 'models/Input', 'views/InputView'], function($, _, Backbone, Input, InputView) {
    var AppView = Backbone.View.extend({

        id: 'application',

        initialize: function() {
            _(this).bindAll('render');

            this.inputView = new InputView({ model: new Input({ parent: this.model }) });

            // window events cannot be handled normally by Backbone Views
            $(window).on('resize', function() {
                this.inputView.$el.css({
                    height: $(window).height(),
                });
            }.bind(this));
        },

        render: function() {
            this.$el.append(this.inputView.$el);
            $(window).trigger('resize');
            this.inputView.render();

            return this;
        },
    });

    return AppView;
});
