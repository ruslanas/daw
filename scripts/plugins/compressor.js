/**
 * Compressor
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/compressor', ['Gadget'], function(Gadget) {

    var Compressor = Gadget.extend({
        init: function() {
            this._super();
            this.title = 'Compressor';
        },

        redraw: function() {
            this.clear();
            var threshold = this.compressor.threshold.value;
            var knee = this.compressor.knee.value;
            var ratio = this.compressor.ratio.value;

            var status = threshold + 'dB'
                + ' knee: ' + knee
                + ' radio: ' + ratio
                + ' release: ' + this.compressor.release.value
                + ' attack: ' + this.compressor.attack.value
                ;

            this.context.fillText(status, 2, this.height() - 2);
            this.updated = false;
        },

        initialize: function() {
            this._super();

            this.compressor = this.audio.createDynamicsCompressor();
            this.rack.recorder.disconnect(this.rack.visualiser);
            this.compressor.connect(this.rack.visualiser);
            this.rack.recorder.connect(this.compressor);
        }
    });

    return Compressor;
});