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

        init: function() {
            this._super();
            this.title = 'Delay';
        },

        redraw: function() {
            // draw to this.context
        },

        connect: function(gadget, channel) {
            if(!gadget.out) {
                throw 'No out node';
            }
            gadget.out.connect(this.input);
            gadget.out.connect(this.out);
        },

        initialize: function() {
            this._super();

            var delay = this.rack.context.createDelay(1.0);
            var feedback = this.rack.context.createGain();
            feedback.gain.value = this.gain;

            delay.connect(feedback);
            feedback.connect(delay);

            delay.delayTime.value = 60 / this.rack.bpm;
            this.input = delay;
            this.out = feedback;
        }
    });

    return Delay;
});