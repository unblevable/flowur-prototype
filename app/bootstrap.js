requirejs.config({
    paths: {
        text: 'lib/text',
        jquery: 'lib/jquery',
        'jquery-ui': 'lib/jquery-ui',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        'backbone-nested': 'lib/backbone-nested-v1.1.2.min',

        'iscroll': 'lib/iscroll',
        'overscroll': 'lib/jquery.overscroll',

        'bootstrap': 'bootstrap/js/bootstrap',

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

        'iscroll': {
            exports: 'iScroll'
        },

        'jquery-ui': {
            deps: ['jquery'],
            exports: '$'
        },

        'overscroll': {
            deps: ['jquery']
        },

        'bootstrap': {
            deps: ['jquery']
        }
    },

    // cache bust (development only)
    urlArgs: 'bust=' + (new Date()).getTime()
});

requirejs(['jquery', 'models/App', 'views/AppView', 'iscroll', 'overscroll'],  function($, App, AppView, iScroll) {
    $(function() {

        var app = new App,
            appView = new AppView({ model: app }),
            iScroller;

        $('body').append(appView.render().$el);
    });
});

// temporary helper functions -------------------------------------------------

var remToPx = function(rems) {
    return parseFloat($('html').css('font-size')) * rems;
}

var pxToRem = function(pxs) {
    return parseFloat(pxs) / parseFloat($('html').css('font-size'));
}
