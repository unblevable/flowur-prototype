define(['jquery', 'underscore', 'backbone', 'vents/InputVent', 'models/Node'], function($, _, Backbone, InputVent, Node) {
    var Nodes = Backbone.Collection.extend({

        model: Node,

        inputVent: InputVent,

        initialize: function() {
            _(this).bind('checkForLastNode');

            this.on({
                'add'       : (function() {
                    this.checkForLastNode();
                }).bind(this),

                'remove'    : (function() {
                    this.checkForLastNode();
                }).bind(this)
            });

        },

        checkForLastNode: function() {
            // have two separate triggered events rather than one triggered event with two additional arguments?
            if(this.length === 1) {
                this.inputVent.trigger('addOrRemove:node', this.at(0), this.length);
            } else {
                this.inputVent.trigger('addOrRemove:node', null, this.length);
            }
        }
    });


    return Nodes;
});
