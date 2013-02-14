requirejs.config({
    paths: {
        jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min',
        underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
        backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min',
        'backbone-nested': 'lib/backbone-nested-v1.1.2.min',

        // MV*
        models: 'models',
        views: 'views',
        collections: 'collections',
        routers: 'routers',
        templates: 'templates'
    },

    shim: {
        underscore: {
            exports: '_'
        },

        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },

        'backbone-nested': {
            deps: ['backbone'],
            exports: 'Backbone'
        },
    }
});

requirejs(['jquery', 'models/App', 'views/AppView'], function($, App, AppView) {
    $(function() {

        var app = new App,
            appView = new AppView({ model: app });

        $('body').append(appView.render().$el);

    });
});

// temporary helper functions -------------------------------------------------

var remToPx = function(rems) {
    return parseFloat($('body').css('font-size')) * rems;
}

var pxToRem = function(pxs) {
    return parseFloat(pxs) / parseFloat($('body').css('font-size'));
}
