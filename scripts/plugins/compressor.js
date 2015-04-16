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

            var status = threshold.toFixed(2) + 'dB'
                + ' knee: ' + knee
                + ' radio: ' + ratio.toFixed(2)
                + ' release: ' + this.compressor.release.value
                + ' attack: ' + this.compressor.attack.value
                ;

            this.context.fillText(status, 2, this.height() - 2);
            this.updated = false;
            var x = this.width() * this.compressor.threshold.value / 100;
            this.vline(-x);
            var y = this.height() * this.compressor.ratio.value / 20;
            this.hline(y);
            this.updated = false;
        },

        onMouseDown: function(e) {
            this.compressor.threshold.value = -100 * this.getX(e) / this.width();
            this.compressor.ratio.value = 20 * this.getY(e) / this.height();
            this.updated = true;
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