define(['jquery', 'underscore', 'backbone', 'vents/InputVent', 'jqueryui', 'jquery.color'], function($, _, Backbone, InputVent) {
    var NodeOptionsView = Backbone.View.extend({

        id: 'node-options',

        className: 'clearfix',

        template: _.template($('#node-options-template').html()),

        // custom properties --------------------------------------------------
        inputVent: InputVent,

        events: {
            'mouseover button': 'lighten',
            'mouseout button': 'darken',
            'click button': 'setType'
        },

        initialize: function() {
            _(this).bindAll('render', 'show', 'hide', 'switchSelectedNode', 'lighten', 'darken', 'setType', 'changeColors');
            _(this).bindAll('toggle');

            this.inputVent.on('show:nodeOptions', this.show);
            this.inputVent.on('hide:nodeOptions', this.hide);
            this.inputVent.on('switchSelectedNode:nodeOptions', this.switchSelectedNode);
            this.inputVent.on('changeColors:nodeOptions', this.changeColors);
        },

        render: function() {
            this.$el.html(this.template);

            this.importanceSlider = this.$('#importance-slider').slider({
                max: 1.6,
                min: 1.0,
                step: 0.1,
                value: 1.0,
                range: 'min',

                slide: function(event, ui) {
                    this.model.get('selectedNode').set('importance', ui.value);

                    this.$('#importance-value').text(ui.value.toFixed(1));
                }.bind(this)

            });

            return this;
        },

        // event handlers -----------------------------------------------------

        toggle: function(event) {
            // if(node.get('isEditingOptions')) {
            //     this.inputVent.trigger('hide:nodeOptions', node);
            //     this.inputVent.trigger('switchSelectedNode:nodeOptions', null);
            // } else {
            //     this.inputVent.trigger('switchSelectedNode:nodeOptions', node);
            //     this.inputVent.trigger('activate:optionsToggle');
            //     this.inputVent.trigger('show:options');
            //     this.inputVent.trigger('show:nodeOptions', node);
            // }
            if(this.isVisible) {
                this.hide();
            } else {
                this.inputVent.trigger('activate:optionsToggle');
                this.inputVent.trigger('show:options');
                this.show();
            }
        },

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

        setType: function(event) {
            var selectedNode = this.model.get('selectedNode'),
                previousType = selectedNode.get('type'),
                type = $(event.target).attr('class');

            if(type !== 'type-' + selectedNode.get('type')) {
                switch(type) {
                    case 'type-question':
                        selectedNode.set('type', 'question');
                        this.$('.selected').hide();
                        this.$('.type-question .selected').show();
                        break;
                    case 'type-answer':
                        selectedNode.set('type', 'answer');
                        this.$('.selected').hide();
                        this.$('.type-answer .selected').show();
                        break;
                    case 'type-other':
                        selectedNode.set('type', 'other');
                        this.$('.selected').hide();
                        this.$('.type-other .selected').show();
                        break;
                }

                this.$('#importance-slider .ui-slider-range').removeClass('type-' + previousType);
                this.$('#importance-slider .ui-slider-range').addClass('type-' + selectedNode.get('type'));
                // this.inputVent.trigger('changeType:bubble', selectedNode, previousType, selectedNode.get('type'));
                console.log(type);
                selectedNode.set('type', type);
            }
        },

        // cross-view event handlers ------------------------------------------

        show: function() {
            var selectedNode = this.model.get('selectedNode');
            this.$('#importance-value').text(selectedNode.get('importance').toFixed(1));
            this.importanceSlider.slider('value', selectedNode.get('importance'));
            this.$('#importance-slider .ui-slider-range').addClass('type-' + selectedNode.get('type'));

            switch(selectedNode.get('type')) {
                case 'question':
                    this.$('.selected').hide();
                    this.$('.type-question .selected').show();
                    break;
                case 'answer':
                    this.$('.selected').hide();
                    this.$('.type-answer .selected').show();
                    break;
                case 'other':
                    this.$('.selected').hide();
                    this.$('.type-other .selected').show();
                    break;
            }

            this.$el.show();
        },

        hide: function(event) {
            this.$el.hide();
        },

        switchSelectedNode: function(node) {
            // if new node is not null
            if(this.model.get('selectedNode')) {
                this.inputVent.trigger('hideIsEditing:bubble', this.model.get('selectedNode'));
                this.model.get('selectedNode').set('isEditingOptions', false);
            }

            this.model.set('selectedNode', node);
            this.inputVent.trigger('showIsEditing:bubble', this.model.get('selectedNode'));

            // if new node is not null
            if(this.model.get('selectedNode')) {
                this.model.get('selectedNode').set('isEditingOptions', true);
                this.show();
            }
        },

        changeColors: function(oldType, newType) {
            this.$('#importance-slider .ui-slider-range').removeClass('type-' + oldType);
            this.$('#importance-slider .ui-slider-range').addClass('type-' + this.model.get('selectedNode').get('type'));
        },
    });

    return NodeOptionsView;
});
