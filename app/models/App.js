define(['jquery', 'underscore', 'backbone', 'models/Node', 'views/NodeView', 'routers/AppRouter'], function($, _, Backbone, Node, NodeView, AppRouter) {
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
            $(selector).css('height', $(window).height());

            // actual app initialization
            var nodeView = new NodeView;
            $('#input').append(nodeView.render);

            // window events cannot be handled by Backbone Views.
            $(window).on('resize', function() {
                $(selector).css('height', $(window).height());
            });
        }
    });

    return App;
});
