define(['jquery', 'underscore', 'backbone', 'vents/InputVent'], function($, _, Backbone, InputVent) {
    var BubbleView = Backbone.View.extend({

        className: 'bubble clearfix',

        minimizedTemplate: _.template($('#minimized-bubble-template').html()),

        maximizedTemplate: _.template($('#maximized-bubble-template').html()),

        // custom properties --------------------------------------------------

        inputVent: InputVent,

        events: {
            'mouseenter': 'rise',
            'mouseleave': 'fall',
            'click': function() { if(this.model.get('isMinimized')) this.maximize(); },
            'dblclick': function() { if(this.model.get('isMinimized')) this.maximize(); },
            'keypress textarea': 'disableReturn',
            'keyup textarea': 'update',
            'click .options': 'toggleNodeOptions',
            'mousedown textarea': function(event) {
                event.stopPropagation();
            }
        },

        initialize: function() {
            _(this).bindAll('render', 'rise', 'fall', 'centerBubble', 'showIsEditing', 'hideIsEditing', 'changeType');
            _(this).bindAll('renderCount', 'maximize', 'minimize', 'disableReturn', 'update', 'toggleNodeOptions', 'handleNodeSelect');
            _(this).bindAll('setType', 'mini', 'max');

            // huh?
            this.model.on({
                'change:count': this.renderCount,
            });

            this.inputVent.on('showIsEditing:bubble', this.showIsEditing);
            this.inputVent.on('hideIsEditing:bubble', this.hideIsEditing);
            this.inputVent.on('changeType:bubble', this.changeType);
        },

        render: function() {
            this.$el.html(this.minimizedTemplate);

            var node = this.model.get('parent'),
                type = node.get('type');

            this.setType(node, type);

            if(this.$el.hasClass('maximized-bubble')) {
                this.$el.removClass('maximized-bubble');
            }
            this.$el.addClass('minimized-bubble');

            this.hideIsEditing();

            return this;
        },

        mini: function() {
            this.$el.html(this.minimizedTemplate);
            this.model.set('isMinimized', true);
            this.setType(this.model.get('parent'), this.model.get('parent').get('type'));

            this.$el.removeClass('minimized-bubble');
            this.$el.addClass('maximized-bubble');

            this.centerBubble();

        },

        max: function() {
            this.$el.html(this.maximizedTemplate({
                remainingCharacterCount: this.model.getRemainingCount(),
                text: this.model.get('text')
            }));

            // this.setRemainingCharacterCount
            // this.setPlaceHolderText

            this.$el.removeClass('minimized-bubble');
            this.$el.addClass('maximized-bubble');

            this.centerBubble();

            this.$el.find('textarea').focus();
            this.$el.find('textarea').select();

            if(this.model.get('parent').get('isEditingOptions')) {
                this.showIsEditing(this.model.get('parent'));
            }

            this.setType(this.model.get('parent'), type);
            this.model.set('isMinimized', false);
        },

        // event handlers -----------------------------------------------------

        renderCount: function() {
            this.$('.remaining-character-count').text(this.model.get('maxCount') - this.model.get('count'));
        },

        maximize: function(event) {
            this.$el.html(this.maximizedTemplate({
                remainingCharacterCount: this.model.getRemainingCount(),
                text: this.model.get('text')
            }));
            this.$el.removeClass('minimized-bubble');
            this.$el.addClass('maximized-bubble');
            this.centerBubble();
            this.$el.find('textarea').focus();
            this.$el.find('textarea').select();
            this.model.set('isMinimized', false);

            if(this.model.get('parent').get('isEditingOptions')) {
                this.showIsEditing(this.model.get('parent'));
            }

            this.setType(this.model.get('parent'), this.model.get('parent').get('type'));
        },

        minimize: function() {
            var node = this.model.get('parent'),
                type = node.get('type');

            this.model.set('isMinimized', true);

            this.$el.html(this.minimizedTemplate({
                text: this.model.get('text'),
                letter: this.model.get('letter')
            }));

            // temp
            this.$('.text').text(this.model.get('text'));

            this.hideIsEditing();

            this.$el.addClass('minimized-bubble');
            if(this.$el.hasClass('maximized-bubble')) {
                this.$el.removeClass('maximized-bubble');
            }

            this.centerBubble();

            this.setType(node, type);
        },

        disableReturn: function(event) {
            // return key
            if(event.which === 13) {
                event.preventDefault();
            }
        },

        update: function(event) {
            // save text
            this.model.set('text', this.$el.find('textarea').val());

            // update count
            this.model.set('count', this.model.get('text').length);

            // minimize view on return key
            if(event.which === 13) {
                this.minimize();
            }
        },

        toggleNodeOptions: function() {
            var node = this.model.get('parent');
            if(node.get('isEditingOptions')) {
                this.inputVent.trigger('hide:nodeOptions', node);
                this.inputVent.trigger('switchSelectedNode:nodeOptions', null);
            } else {
                this.inputVent.trigger('switchSelectedNode:nodeOptions', node);
                this.inputVent.trigger('activate:optionsToggle');
                this.inputVent.trigger('show:options');
                this.inputVent.trigger('show:nodeOptions', node);
            }

            // if editing
            // hide options
            // else
            // show options (with the right node)
        },

        handleNodeSelect: function(event) {
            if(this.model.get('isMinimized')) {
                this.maximize();
            } else {
                this.minimize();
            }
        },

        // other methods ------------------------------------------------------
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

        centerBubble: function() {
            this.$el.css({
                position: 'absolute',
                left: '50%',
                'margin-left': -1 * pxToRem(this.$el.outerWidth()) / 2 + 'rem'
            });
        },

        showIsEditing: function(node) {
            if(this.model.get('parent') === node) {
                this.$('.remaining-character-count').hide();
                this.$('.editing-options-notification').show();
                this.model.get('parent').set('isEditingOptions', true);
            }
        },

        hideIsEditing: function(node) {
            if(this.model.get('parent') === node) {
                this.$('.remaining-character-count').show();
                this.$('.editing-options-notification').hide();
                this.model.get('parent').set('isEditingOptions', false);
            }
        },

        changeType: function(node, oldType, newType) {
            if(this.model.get('parent') === node) {
                this.$('.tip').removeClass('tip-' + oldType);
                this.$('textarea').removeClass('textarea-' + oldType);
                this.$el.removeClass('type-' + oldType);

                switch(newType) {
                    case 'question':
                        this.model.set('letter', 'Q');
                        this.$el.addClass('question-bubble');
                        break;
                    case 'answer':
                        this.model.set('letter', 'A');
                        this.$el.addClass('answer-bubble');
                        break;
                    case 'other':
                        this.model.set('letter', 'O');
                        this.$el.addClass('statement-bubble');
                        break;
                }

                this.$('.letter').text(this.model.get('letter'));
                console.log(newType);
                this.$('.tip').addClass(newType + '-tip');
                this.$('textarea').addClass(newType + '-textarea');

                // new
                this.inputVent.trigger('changeColors:nodeOptions', oldType, newType);
            }
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
                    this.model.set('placeholder', 'Statement.');
                    break;
            }

            this.$('.letter').text(this.model.get('letter'));
            this.$('textarea').attr('placeholder', this.model.get('placeholder'));
        }
    });

    return BubbleView;
});
