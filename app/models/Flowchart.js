define(function(require, exports, module) {
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone');

    var Flowchart = Backbone.Model.extend({

        defaults: {
            nodes: null,
            arrows: null,
            title: '',
        },

        initialize: function() {
            _(this).bindAll('addNode', 'removeNode', 'updateNode', 'addArrow', 'removeArrow');

            this.setAsArray('nodes', 'arrows');
        },

        // Modification methods.

        addNode: function(attributes) {
            this.get('nodes').push({
                id: attributes.id,
                data: attributes.data
            });

            this.trigger('change');
        },

        removeNode: function(id) {
            var index = _(this.get('nodes')).indexOf(_(this.get('nodes')).findWhere({ id: id }));

            if(index !== -1) {
                this.get('nodes').splice(index, 1);

                this.trigger('change');
            }
        },

        updateNode: function(attributes) {
            var index = _(this.get('nodes')).indexOf(_(this.get('nodes')).findWhere({ id: attributes.id }));

            this.get('nodes')[index].data = attributes.data;

            this.trigger('change');
        },

        addArrow: function(attributes) {
            this.get('arrows').push({
                id: attributes.id,
                from: attributes.from,
                to: attributes.to
            });

            this.trigger('change');
        },

        removeArrow: function(id) {
            var index = _(this.get('arrows')).indexOf(_(this.get('arrows')).findWhere({ id: id }));

            if(index !== -1) {
                this.get('arrows').splice(index, 1);

                this.trigger('change');
            }
        },

        setAsArray: function() {
            _(arguments).each(function(argument, index) {
                if(_(argument).isString()) {
                    if(!this.get(argument)) this.set(argument, []);
                }
            }.bind(this));
        },
    });

    return Flowchart;
});
