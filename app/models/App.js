var App = Backbone.Model.extend({
    initialize: function() {

        var appRouter = new AppRouter();
        Backbone.history.start();

        // phases are the three sections of the app
        var phases = ['input', 'visualize', 'share'];
        _.each(phases, function(phase, index) {
            phases[index] = '#' + phase;
        });
        var selector = phases.join(',');
        console.log(selector);


        // These events cannot be handled by Backbone Views.

        $(document).on('ready', function() {
            $(selector).css('height', $(window).height());
        });
        $(window).on('resize', function() {
            $(selector).css('height', $(window).height());
        });
    }
});
