define(function(require, exports, module) {
    var $                       = require('jquery'),
        _                       = require('underscore'),
        Backbone                = require('backbone'),
        Input                   = require('models/Input'),
        TemplateInterface       = require('models/TemplateInterface'),
        Output                  = require('models/Output'),
        InputView               = require('views/InputView'),
        TemplateInterfaceView   = require('views/TemplateInterfaceView'),
        OutputView              = require('views/OutputView');

    var AppView = Backbone.View.extend({

        id: 'application',

        events: {
        },

        initialize: function() {
            _(this).bindAll('render');

            this.inputView = new InputView({ model: new Input({ parent: this.model }) });
            this.templateInterfaceView = new TemplateInterfaceView({ model: new TemplateInterface({ parent: this.model }) });
            this.outputView = new OutputView({ model: new Output({ parent: this.model }) });

            // window events cannot be handled normally by Backbone Views
            var $window = $(window);
            $window.on('resize', function() {
                this.inputView.$el.css({
                    height: $(window).height(),
                });
                this.templateInterfaceView.$el.css({
                    height: $(window).height(),
                });
                this.outputView.$el.css({
                    height: $(window).height(),
                });
            }.bind(this));
        },

        render: function() {
            this.$el.append(this.inputView.$el);
            this.$el.append(this.templateInterfaceView.$el);
            this.$el.append(this.outputView.$el);

            $(window).trigger('resize');

            this.inputView.render();
            this.templateInterfaceView.render();
            this.outputView.render();

            return this;
        },
    });

    return AppView;
});
