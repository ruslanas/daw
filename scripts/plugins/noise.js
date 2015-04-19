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
            this.title = 'Noise';
        },

        onMouseDown: function(event) {
            this.on = !this.on;
            if(this.on) {
                this.source = this.audio.createBufferSource();

                this.source.buffer = this.arrayBuffer;
                this.source.loop = true;
                this.source.connect(this.out);
                this.source.start();

            } else if(this.source) {
                this.source.stop();
                this.source.disconnect(this.out);
            }

            this.updated = true;
        },

        redraw: function() {
            this.clear();
            if(this.on) {
                for(var i=0;i<200;i++) {
                    this.context.fillRect(Math.random() * this.width(), Math.random() * this.height(), 1, 1);
                }
            } else {
                this.updated = false;
            }
        },

        initialize: function() {
            this._super();

            var len = this.audio.sampleRate * 5.0;
            this.arrayBuffer = this.audio.createBuffer(
                1, len, this.audio.sampleRate);

            var chData = this.arrayBuffer.getChannelData(0);

            // white noise
            for(var i=0;i<len;i++) {
                chData[i] = Math.random() * 2 - 1;
            }

            // Brown noise
            // var curr = 0;
            // for(var i=0;i<len;i++) {
            //     curr += (Math.random(1) - 0.5) / 20;
            //     chData[i] = curr;
            // }

            this.out = this.audio.createGain();

        }
    });

    return Noise;
});
