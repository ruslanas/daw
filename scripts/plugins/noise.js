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

        init: function() {
            this._super();
            this.title = 'Noise Generator';
        },

        redraw: function() {
            // draw to this.context
        },

        initialize: function() {
            this._super();

            var source = this.audio.createBufferSource();

            var len = this.audio.sampleRate * 5.0;
            var arrayBuffer = this.audio.createBuffer(
                1, len, this.audio.sampleRate);

            var chData = arrayBuffer.getChannelData(0);
            for(var i=0;i<len;i++) {
                chData[i] = Math.random() * 2 - 1;
            }

            source.buffer = arrayBuffer;
            source.loop = true;
            source.start();

            this.out = source;

        }
    });

    return Noise;
});
