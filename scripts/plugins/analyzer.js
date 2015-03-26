/**
 * Analyser
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/analyzer', ['Gadget'], function(Gadget) {

	var Analyzer = Gadget.extend({
		init: function() {
			this._super();
			this.title = 'Analyzer';
		},

		redraw: function() {

			this.clear();

			this.rack.analyzer.getByteFrequencyData(this.dataArray);

			var barWidth = (this.canvas.width / this.bufferLength) * 2.5;
			var barHeight, x = 0;

			for(var i = 0; i < this.bufferLength; i++) {
				barHeight = this.dataArray[i] / 2;
				this.context.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
				x += barWidth + 1;
			}
      	},

      	// insert between masterGain and visualiser
		initialize: function() {
			this._super();

			this.rack.analyzer = this.rack.context.createAnalyser();
			this.rack.visualiser.disconnect(this.rack.context.destination);
			this.rack.visualiser.connect(this.rack.analyzer);
			this.rack.analyzer.connect(this.rack.context.destination);
			this.rack.analyzer.fftSize = this.options.fft_size || 128;

			this.bufferLength = this.rack.analyzer.frequencyBinCount;
			this.dataArray = new Uint8Array(this.bufferLength);
		}
	});

	return Analyzer;
});
