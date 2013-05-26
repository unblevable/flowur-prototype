define(function(require, exports, module) {
    var $                       = require('jquery'),
        _                       = require('underscore'),
        Backbone                = require('backbone'),
        Input                   = require('models/Input'),
        TemplateInterface       = require('models/TemplateInterface'),
        InputView               = require('views/InputView'),
        TemplateInterfaceView   = require('views/TemplateInterfaceView');

    var AppView = Backbone.View.extend({

        id: 'application',

        events: {
        },

        initialize: function() {
            _(this).bindAll('render');

            this.inputView = new InputView({ model: new Input({ parent: this.model }) });
            this.templateInterfaceView = new TemplateInterfaceView({ model: new TemplateInterface({ parent: this.model }) });

            // window events cannot be handled normally by Backbone Views
            var $window = $(window);
            $window.on('resize', function() {
                this.inputView.$el.css({
                    height: $(window).height(),
                });
                this.templateInterfaceView.$el.css({
                    height: $(window).height(),
                });
            }.bind(this));
        },

        render: function() {
            this.$el.append(this.inputView.$el);
            this.$el.append(this.templateInterfaceView.$el);

            $(window).trigger('resize');

            this.inputView.render();
            this.templateInterfaceView.render();

            return this;
        },
    });

    return AppView;
});
