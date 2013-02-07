requirejs.config({
    paths: {
        jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min',
        underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
        backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min',

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
        }
    }
});

requirejs(['jquery', 'models/App'], function($, App) {
    $(function() {
        var app = new App();
    });
});
