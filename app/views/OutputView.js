define(function(require, exports, module) {
    var $                       = require('jquery'),
        _                       = require('underscore'),
        Backbone                = require('backbone'),
        OutputTemplate          = require('text!templates/output.html'),
        FlowchartVent           = require('vents/FlowchartVent');

    var OutputView = Backbone.View.extend({

        id: 'output',

        outputTemplate: _.template(OutputTemplate),

        events: {
            'dblclick': function() {
                this.tree.generate($.parseJSON(JSON.stringify(this.model.get('flowchart'))), document.getElementById('output-flowchart'));
            }
        },

        initialize: function() {
            _(this).bindAll('render');

            // temp
            var Tree = require('modules/TreeTemplate');
            if(Tree) {
                this.tree = new Tree();
            }

            FlowchartVent.on({
                'update:output': function(flowchart) {
                    this.model.set('flowchart', flowchart);
                }.bind(this)
            });
        },

        render: function() {
            this.$el.html(this.outputTemplate);

        }
    });

    return OutputView;
});
