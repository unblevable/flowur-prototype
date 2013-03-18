define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var InputOptions = Backbone.Model.extend({

        defaults: {
            zoom: 100,
        },

        initialize: function() {
        }
    });

    return InputOptions;
});
