define(['jquery-ui', 'underscore', 'backbone', 'vents/InputVent'], function($, _, Backbone, InputVent) {
    var NodeOptionsView = Backbone.View.extend({

        id: 'node-options',

        className: 'clearfix',

        template: _.template($('#node-options-template').html()),

        // custom properties --------------------------------------------------
        inputVent: InputVent,

        events: {
            'mouseover button'  : 'lighten',
            'mouseout button'   : 'darken',

                                // change selected node's type and reflect changes in menu
            'click button'      : function(event) {
                var buttonClass = $(event.target).attr('class'),
                    selectedNode = this.model.get('selectedNode'),
                    previousType = selectedNode.get('type'),
                    currentType;

                switch(buttonClass) {
                    case 'question-button':
                        currentType = 'question';
                        break;
                    case 'answer-button':
                        currentType = 'answer';
                        break;
                    case 'statement-button':
                        currentType = 'statement';
                        break;
                }

                selectedNode.set('type', currentType);

                this.syncType(previousType, currentType);
            }
        },

        initialize: function() {
            _(this).bindAll('render',  'lighten', 'darken', 'syncType');
            _(this).bindAll('show', 'hide', 'setSelectedNode', 'unsetSelectedNode', 'syncType', 'syncImportance');

            this.inputVent.on({
                'showNodeOptions'       : this.show,
                'hideNodeOptions'       : this.hide,
                'change:nodeImportance' : this.syncImportance,
                'delete:node'           : (function(node) {
                    if(this.model.get('selectedNode') === node) {
                        this.hide();
                    }
                }).bind(this)
            });
        },

        render: function() {
            this.$el.html(this.template);

            this.importanceSlider = this.$('#importance-slider').slider({
                max: 1.5,
                min: 0.75,
                step: 0.25,
                value: 1.0,
                range: 'min',

                slide: function(event, ui) {
                    var selectedNode = this.model.get('selectedNode');
                    selectedNode.set('importance', ui.value);

                    this.syncImportance(selectedNode.get('importance'));
                }.bind(this)

            });

            return this;
        },

        // event handlers -----------------------------------------------------

        lighten: function(event) {
            $(event.target).stop(true, true).animate({
                'opacity': 0.75
            }, {
                duration: 250,
            });
        },

        darken: function(event) {
            $(event.target).stop(true, true).animate({
                opacity: 1.0
            }, {
                duration: 400,
            });
        },

        // cross-view event handlers ------------------------------------------

        show: function(node) {
            var previousNode = this.model.get('selectedNode'),
                previousType;

            // unselect any node that is editing
            if(previousNode) {
                this.unsetSelectedNode();
                previousType = previousNode.get('type');
            } else {
                previousType = null;
            }

            this.setSelectedNode(node);

            var selectedNode = this.model.get('selectedNode');

            this.syncType(previousType, selectedNode.get('type'));
            this.syncImportance(selectedNode.get('importance'));

            this.$el.show();
        },

        hide: function() {
            this.unsetSelectedNode();
            this.$el.hide();
        },

        setSelectedNode: function(node) {
            this.model.set('selectedNode', node);
            this.inputVent.trigger('setSelectedNode', this.model.get('selectedNode'));
        },

        unsetSelectedNode: function() {
            this.inputVent.trigger('unsetSelectedNode', this.model.get('selectedNode'));
            this.model.set('selectedNode', null);
        },

        //  reflect selected node's type changes in node options
        syncType: function(previousType, currentType) {
            if(previousType !== currentType) {
                // change check icon
                this.$('.selected').hide();
                // (ugly hard code)
                this.$('.' + currentType + '-button .selected').show();

                // change slider background
                // this.$('#importance-slider .ui-slider-range').removeClass(previousType + '-slider');
                _(this.$('#importance-slider .ui-slider-range').attr('class').split(/\s+/)).each((function(klass, index) {
                    if(klass.contains('answer') || klass.contains('question') || klass.contains('statement')) {
                        console.log(klass);
                        this.$('#importance-slider .ui-slider-range').removeClass(klass);
                    }
                }).bind(this));

                this.$('#importance-slider .ui-slider-range').addClass(currentType + '-slider');
            }

        },

        syncImportance: function(importance) {
            this.$('#importance-value').text(importance.toFixed(2));
            this.importanceSlider.slider('value', importance);
        }
    });

    return NodeOptionsView;
});
