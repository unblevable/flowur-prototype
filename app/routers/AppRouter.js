var AppRouter = Backbone.Router.extend({

    routes: {
        ':flowchart': 'show',
        ':flowchart/input': 'input',
        ':flowchart/visualize': 'visualize',
        ':flowchart/share': 'share'
    },

    show: function() {
        // will define much later
    },

    input: function(flowchart) {
    },

    visualize: function(flowchart) {
    },

    share: function(flowchart) {
    }
});
