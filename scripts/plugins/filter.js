/**
 * Filter
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/filter', ['Gadget'], function(Gadget) {

    var Filter = Gadget.extend({

        input: null,
        out: null,
        type: 'lowshelf',
        down: false,

        init: function() {
            this._super();
            this.title = 'Low Shelf Filter';
        },

        redraw: function() {
            this.clear();
            this.context.fillRect(this.x - 2, this.y - 2, 4, 4);
        },

        connect: function(gadget) {
            if(!gadget.out) {
                throw 'No out node';
            }
            gadget.out.connect(this.input);
        },

        onMouseDown: function(event) {
            this.down = true;
            this.x = this.getX(event);
            this.y = this.canvas.height - this.getY(event);
            this.reset();
        },

        onMouseUp: function(event) {
            this.down = false;
        },

        onMouseMove: function(event) {
            if(!this.down) {
                return;
            }
            this.x = this.getX(event);
            this.y = this.canvas.height - this.getY(event);
            this.reset();
        },

        reset: function() {
            this.out.frequency.value = (this.rack.context.sampleRate / 2) * this.x / this.canvas.width;
            // [-40; 40] dB
            this.out.gain.value = 80 * this.y / this.canvas.height - 40;
        },

        initialize: function() {
            this._super();
            var filter = this.rack.context.createBiquadFilter();

            filter.type = this.type;
            filter.frequency.value = 1000;
            filter.gain.value = 0;

            this.input = filter;
            this.out = filter;

        }
    });

    return Filter;
});