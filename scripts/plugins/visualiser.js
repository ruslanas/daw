/*
 * Buffer visualiser
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/visualiser', ['Gadget'], function(Gadget) {

    var Visualiser = Gadget.extend({

        max: 0,
        peakTime: null,
        help: "Visualizes current data in buffer and displays peak amplitude. Keeep it below 1.",

        init: function() {
            this._super();
            this.title = 'Visualizer';
        },

        redraw: function() {

            this.clear();

            var max = 0;

            // find frame maximum
            for(var i=0;i<this.canvas.width;i++) {
                var amp = this.rack.buffer[i];
                max = Math.max(max, Math.abs(amp));
                var height = this.baseline + amp * this.scale;
                this.context.fillRect(i, height, 1, 1);
            }

            if(max > this.max) {
                this.peakTime = this.audio.currentTime;
                this.max = max;
            }

            this.context.fillText(this.max.toFixed(4), 7, this.canvas.height - 2);
            this.context.fillRect(0, this.canvas.height, 5, -Math.min(this.canvas.height, this.canvas.height * this.max));

            // drop by 2 in 1 second
            this.max = this.max - (this.audio.currentTime - this.peakTime) * 2;
            this.peakTime = this.audio.currentTime;
        },

        initialize: function() {

            this._super();

            this.scale = this.height() / 2;
            this.parent.querySelector('.titlebar h5').innerHTML += ' (' + this.rack.recordFrameLen + ')';
        }
    });

    return Visualiser;
});
