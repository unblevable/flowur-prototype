define(['jquery', 'underscore', 'backbone', 'vents/InputVent'], function($, _, Backbone, InputVent) {
    var BubbleView = Backbone.View.extend({

        className: 'bubble clearfix',

        minimizedTemplate: _.template($('#minimized-bubble-template').html()),

        maximizedTemplate: _.template($('#maximized-bubble-template').html()),

        // custom properties --------------------------------------------------

        inputVent: InputVent,

        events: {
            'mouseenter'            : 'rise',
            'mouseleave'            : 'fall',
            'click'                 : function() { if(this.model.get('isMinimized')) this.maximize(); },
            'dblclick'              : function() { if(this.model.get('isMinimized')) this.maximize(); },

                                    // disable newlines
            'keypress textarea'     : function(event) { if(event.which === 13) event.preventDefault(); },

                                    // update maximized view
            'keyup textarea'        : function(event) {
                this.model.set('text', this.$el.find('textarea').val());
                this.model.set('count', this.model.get('text').length);

                // minimize on return key
                if(event.which === 13) {
                    this.minimize();
                }
            },
                                    // prevent bubble min/max from interfering
            'mousedown textarea'    : function(event) { event.stopPropagation(); },

            'click .options'        : 'toggleNodeOptions'
        },

        initialize: function() {
            _(this).bindAll('render', 'rise', 'fall', 'toggleNodeOptions');
            _(this).bindAll('maximize', 'minimize', 'center', 'handleNodeSelect', 'showIsEditing', 'hideIsEditing');
            _(this).bindAll('setType');

            this.inputVent.on({
                'setSelectedNode'   : this.showIsEditing,
                'unsetSelectedNode' : this.hideIsEditing
            });

            this.model.on({
                'change:count': (function() { this.$('.remaining-character-count').text(this.model.get('maxCount') - this.model.get('count')); }).bind(this)
            });
        },

        render: function() {
            // defer for textarea focus
            _.defer(this.maximize);

            return this;
        },

        // event handlers -----------------------------------------------------

        rise: function() {
            if(!this.model.get('isHighlighted')) {
                this.$el.stop(true, true).animate({ bottom: pxToRem(parseFloat(this.$el.css('bottom'))) + this.model.get('highlightDistance') + 'rem'}, 0, 'linear', this.model.set('isHighlighted', true));
            }
        },

        fall: function() {
            if(this.model.get('isHighlighted')) {
                this.$el.stop(true, true).animate({ bottom: pxToRem(parseFloat(this.$el.css('bottom'))) - this.model.get('highlightDistance') + 'rem'}, 0, 'linear', this.model.set('isHighlighted', false));
            }
        },

        toggleNodeOptions: function() {
            var node = this.model.get('parent');

            if(node.get('isEditingOptions')) {
                this.inputVent.trigger('hideNodeOptions', node);
            } else {
                this.inputVent.trigger('showNodeOptions', node);
            }
        },


        // cross-view event handlers ------------------------------------------

        maximize: function(event) {
            var node = this.model.get('parent'),
                type = node.get('type');

            this.model.set('isMinimized', false);

            this.$el.html(this.maximizedTemplate({
                text: this.model.get('text'),
                remainingCharacterCount: this.model.getRemainingCount(),
            }));

            this.$el.removeClass('minimized-bubble');
            this.$el.addClass('maximized-bubble');


            this.setType(node, type);

            this.center();

            this.$('textarea').focus();
            this.$('textarea').select();

            if(this.model.get('parent').get('isEditingOptions')) {
                this.showIsEditing(node);
            }
        },

        minimize: function() {
            var node = this.model.get('parent'),
                type = node.get('type');

            this.model.set('isMinimized', true);

            this.$el.html(this.minimizedTemplate({
                text: this.model.get('text'),
                letter: this.model.get('letter')
            }));

            this.$el.removeClass('maximized-bubble');
            this.$el.addClass('minimized-bubble');

            this.setType(node, type);

            this.center();

            this.hideIsEditing();
        },

        handleNodeSelect: function(event) {
            if(this.model.get('isMinimized')) {
                this.maximize();
            } else {
                this.minimize();
            }
        },

        showIsEditing: function(selectedNode) {
            var node = this.model.get('parent');

            if(node === selectedNode) {
                this.$('.remaining-character-count').hide();
                this.$('.editing-options-notification').show();
                node.set('isEditingOptions', true);
            }
        },

        hideIsEditing: function(selectedNode) {
            var node = this.model.get('parent');

            if(node === selectedNode) {
                this.$('.remaining-character-count').show();
                this.$('.editing-options-notification').hide();
                node.set('isEditingOptions', false);
            }
        },

        // other methods ------------------------------------------------------

        center: function() {
            this.$el.css({
                position: 'absolute',
                left: '50%',
                'margin-left': -1 * pxToRem(this.$el.outerWidth()) / 2 + 'rem'
            });
        },

        setType: function(model, type) {
            var previousType = model.previous('type');

            // manage classes (colors)
            if(previousType) {
                this.$el.removeClass(model.previous('type') + '-bubble');
                this.$('.tip').removeClass(model.previous('type') + '-tip');
                this.$('textarea').removeClass(model.previous('type') + '-textarea');
            }

            this.$el.addClass(type + '-bubble');
            this.$('.tip').addClass(type + '-tip');
            this.$('textarea').addClass(type + '-textarea');

            // change letter prefix and textarea placeholder
            switch(type) {
                case 'question':
                    this.model.set('letter', 'Q');
                    this.model.set('placeholder', 'Question?');
                    break;
                case 'answer':
                    this.model.set('letter', 'A');
                    this.model.set('placeholder', 'Answer.');
                    break;
                case 'statement':
                    this.model.set('letter', 'S');
                    this.model.set('placeholder', 'Something else.');
                    break;
            }

            this.$('.letter').text(this.model.get('letter'));
            this.$('textarea').attr('placeholder', this.model.get('placeholder'));
        }
    });

    return BubbleView;
});
