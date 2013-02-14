define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var App = Backbone.Model.extend({

        defaults: {
            phases: ['input', 'visualize', 'share'],
        },

        initialize: function() {
            _(this).bindAll();
        },
    });

    return App;
});
