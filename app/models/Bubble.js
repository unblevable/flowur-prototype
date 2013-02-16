define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Bubble = Backbone.Model.extend({

        defaults: {
            parent: null,               // parent view
            isMini: true,               // is mini or expanded bubble
            isHighlighted: false,       // is bubble in a hover state
            isFocused: true,            // is bubble textbox focused
            highlightDistance: 0.5,     // how far the bubble rises/descends on hover
            text: '',                   // text
            count: 0,                   // character count
            maxCount: 140               // max character count
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
