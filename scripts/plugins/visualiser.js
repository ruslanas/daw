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

        init: function() {
            this._super();
            this.title = 'Visualizer';
        },

        redraw: function() {

            this.clear();

            var max = 0;

            for(var i=0;i<this.canvas.width;i++) {
                var amp = this.rack.buffer[i];
                if(Math.abs(amp) > max) {
                    max = Math.abs(amp);
                }
                var height = this.baseline + amp * this.scale;
                this.context.fillRect(i, height, 1, 1);
            }

            if(max > this.max) {
                this.peakTime = this.audio.currentTime;
                this.max = max;
            }
            this.context.fillText(this.max.toFixed(4), 7, this.height() - 2);
            this.context.fillStyle = 'rgb(' + Math.round(this.max * 255) + ', 0, 0)';
            this.context.fillRect(0, this.height(), 5, -this.height() * this.max);

            // drop by 1 in 1 second
            this.max = this.max - (this.audio.currentTime - this.peakTime);
            this.peakTime = this.audio.currentTime;
        },

        update: function() {

        },

        initialize: function() {
            this._super();
            this.scale = this.height() / 2;
            this.parent.querySelector('.titlebar').innerHTML += ' (' + this.rack.recordFrameLen + ')';
        }
    });

    return Visualiser;
});
