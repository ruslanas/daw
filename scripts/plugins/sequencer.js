/**
 * Sequencer
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */
define('plugins/sequencer', ['Gadget'], function(Gadget) {

    var Sampler = Gadget.extend({

        pattern: [
            -1, 1, 1, 2,
            1, 2, 1, 4,
            5, 6, 5, 6,
            5, 6, 5, 20
        ],
        idx: 0,
        on: false,

        init: function() {
            this._super();
            this.title = 'Sequencer';
        },

        onClick: function(event) {
            this.on = !this.on;
        },

        redraw: function() {
            // draw to this.context
        },

        next: function() {
            var note = this.pattern[this.idx % this.pattern.length];
            this.idx++
            return note;
        },

        initialize: function() {
            this._super();
            // setup
        }
    });

    return new Sampler();
});