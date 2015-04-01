/**
 * Delay
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/delay', [
    'Gadget'
    ], function(Gadget) {

    var Delay = Gadget.extend({

        gain: 0.5,
        delay: null,
        feedback: null,
        down: false,

        init: function() {
            this._super();
            this.title = 'Delay';
        },

        redraw: function() {
            this.clear();
            this.context.fillStyle = '#FF0';
            this.context.fillRect(
                this.feedback.gain.value * this.canvas.width - 2,
                (1 - this.delay.delayTime.value) * this.canvas.height - 2, 4, 4);
            this.updated = false;
        },

        connect: function(gadget, channel) {
            if(!gadget.out) {
                throw 'No out node';
            }
            gadget.out.connect(this.input);
            gadget.out.connect(this.out);
        },

        onChange: function(event) {

            var x = this.getX(event);
            var y = this.height() - this.getY(event);
            this.feedback.gain.value = x / this.canvas.width;
            this.delay.delayTime.value = y / this.canvas.height;
            this.updated = true;
        },

        onMouseDown: function(event) {
            this.down = true;
            this.onChange(event);
        },

        onMouseUp: function(event) {
            this.down = false;
            this.onChange(event);
        },

        onMouseMove: function(event) {
            if(!this.down) {
                return;
            }
            this.onChange(event);
        },

        initialize: function() {
            this._super();

            this.delay = this.rack.context.createDelay(1.0);
            this.feedback = this.rack.context.createGain();
            this.feedback.gain.value = this.gain;

            this.delay.connect(this.feedback);
            this.feedback.connect(this.delay);

            this.delay.delayTime.value = 60 / this.rack.bpm;
            this.input = this.delay;
            this.out = this.feedback;
        }
    });

    return Delay;
});