/**
 * Noise generator
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/noise', ['Gadget'], function(Gadget) {

    var Noise = Gadget.extend({

        out: null,
        input: null,
        on: false,
        source: null,
        arrayBuffer: null,

        init: function() {
            this._super();
            this.title = 'Noise Generator';
        },

        onClick: function(event) {
            this.on = !this.on;
            if(this.on) {
                this.source = this.audio.createBufferSource();

                this.source.buffer = this.arrayBuffer;
                this.source.loop = true;
                this.source.connect(this.out);
                this.source.start();

            } else {
                this.source.stop();
                this.source.disconnect(this.out);
            }
            this.updated = true;
        },

        redraw: function() {
            this.clear();
            var msg = 'off';
            if(this.on) {
                msg = 'on';
            }
            this.context.fillText(msg, 2, this.canvas.height - 2);
            this.updated = false;
        },

        initialize: function() {
            this._super();

            var len = this.audio.sampleRate * 5.0;
            this.arrayBuffer = this.audio.createBuffer(
                1, len, this.audio.sampleRate);

            var chData = this.arrayBuffer.getChannelData(0);
            for(var i=0;i<len;i++) {
                chData[i] = Math.random() * 2 - 1;
            }

            this.out = this.audio.createGain();

        }
    });

    return Noise;
});
