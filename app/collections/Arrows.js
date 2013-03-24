define(['jquery', 'underscore', 'backbone', 'vents/InputVent', 'models/Arrow'], function($, _, Backbone, InputVent, Arrow) {
    var Arrows = Backbone.Collection.extend({

        model: Arrow,

        inputVent: InputVent,

        initialize: function() {
            _(this).bind('checkForLastNode');

            this.on({
                'add'       : (function() {
                    this.inputVent.trigger('addOrRemove:arrow', this.length);
                }).bind(this),

                'remove'    : (function() {
                    this.inputVent.trigger('addOrRemove:arrow', this.length);
                }).bind(this)
            });

        },
    });


    return Arrows;
});
