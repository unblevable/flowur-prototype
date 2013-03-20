define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Bubble = Backbone.Model.extend({

        defaults: {
            // note that properties that should be related to the node (text, isEditingOptions) are handled by the node model
            parent: null,               // parent view
            isMinimized: true,          // minimized or maximized state
            isHighlighted: false,       // is bubble in a hover state
            isFocused: true,            // is bubble textbox focused
            highlightDistance: 0.5,     // how far the bubble rises/descends on hover
            text: '',                   // text
            count: 0,                   // character count
            maxCount: 140,              // max character count
        },

        initialize: function() {
            _(this).bindAll('getRemainingCount');
        },

        getRemainingCount: function() {
            return this.get('maxCount') - this.get('count');
        }
    });

    return Bubble;
});
