/**
 * Sampler plugin
 * @author Ruslanas Balciunas
 */

define('plugins/sampler', ['Gadget'], function(Gadget) {

    var Sampler = Gadget.extend({
        init: function() {
            this._super();
            this.title = 'Sampler';
            this.width(512);
            this.height(50);
        },

        redraw: function() {
            this.clear();
            this.context.fillText(this.options.url,
                this.canvas.width / 2, this.baseline);
        },

        initialize: function() {
            this._super();
            // setup
        }
    });

    return new Sampler();

});
