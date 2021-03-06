/**
 * Analyser
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/analyzer', ['Gadget'], function(Gadget) {

    var Analyzer = Gadget.extend({

        column: 0,
        help: "Visual representation of the spectrum of"
              + " frequencies in master output as they vary with time.",

        init: function() {
            this._super();
            this.title = 'Analyzer';
        },

        redraw: function() {

            this.rack.analyzer.getByteFrequencyData(this.dataArray);

            for(var i = 0; i < this.bufferLength; i++) {

                this.context.fillStyle = 'rgb(' + this.dataArray[i] + ', 0, 0)';
                this.context.fillRect(this.column % this.width(), this.height() - i, 1, 1);
            }

            this.column++;
        },

        // insert between masterGain and visualiser
        initialize: function() {
            this._super();

            this.rack.analyzer = this.rack.context.createAnalyser();

            this.rack.visualiser.connect(this.rack.analyzer);
            this.rack.analyzer.connect(this.rack.context.destination);

            this.rack.analyzer.fftSize = this.options.fft_size || 128;

            this.bufferLength = this.rack.analyzer.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
        }
    });

    return Analyzer;
});
