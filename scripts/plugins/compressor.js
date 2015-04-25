/**
 * Compressor
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/compressor', ['Gadget'], function(Gadget) {

    var Compressor = Gadget.extend({

        help: "Compression is the process of lessening the dynamic range between"
            + " the loudest and quietest parts of an audio signal. This is done by"
            + " boosting the quieter signals and attenuating the louder signals.",

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
                + ' radio: ' + ratio.toFixed(2)
                + ' knee: ' + knee
                + ' release: ' + this.compressor.release.value
                + ' attack: ' + this.compressor.attack.value
                ;

            this.context.fillText(status, 2, this.height() - 2);

            var x = this.width() * this.compressor.threshold.value / 100;
            var y = this.height() * this.compressor.ratio.value / 20;

            this.vline(-x);
            this.hline(y);

            this.updated = false;
        },

        onChange: function(e) {
            this.compressor.threshold.value = -100 * this.getX(e) / this.width();
            this.compressor.ratio.value = 20 * this.getY(e) / this.height();
            this.updated = true;
        },

        onMouseMove: function(e) {
            if(this.down) {
                this.onChange(e);
            }
        },

        onMouseDown: function(e) {
            this.down = true;
            this.onChange(e);
        },

        onMouseUp: function(e) {
            this.down = false;
        },

        initialize: function() {
            this._super();

            this.compressor = this.audio.createDynamicsCompressor();
            this.rack.masterGain.connect(this.compressor);
            this.compressor.connect(this.rack.visualiser);
        }
    });

    return Compressor;
});