var BaseView = function(options) {

    this.bindings = [];
    Backbone.View.apply(this, options);
};

_.extend(BaseView.prototype, Backbone.View.prototype, {

    bindTo: function(model, event, callback) {

        model.bind(event, callback, this);
        this.bindings.push({
            model: mode,
            event: event,
            callback: callback
        });
    },

    unbindFromAll: function() {

        _.each(this.bindings, function(binding) {
            binding.model.unbind(binding.event, binding.callback);
        });

        this.bindings = [];
    },

    destroy: function() {
        this.unbindFromAll();
        this.unbind();
        this.remove();
    }
});
