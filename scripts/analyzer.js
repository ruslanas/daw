/*
Gadget is connected to GUI canvas. It is responsible
for redrawing itself.
*/

define('analyzer', ['Gadget'], function(Gadget) {

	// Gadget class
	var Analyzer = Gadget.extend({
		init: function() {
			this.title = 'Analyzer';
		},
		redraw: function() {
			this.clear();
			this.rack.analyzer.getByteFrequencyData(this.dataArray);

			var barWidth = (this.canvas.width / this.bufferLength) * 2.5;
			var barHeight, x = 0;

			for(var i = 0; i < this.bufferLength; i++) {
				barHeight = this.dataArray[i] / 2;
				this.context.fillRect(x, this.canvas.height - barHeight / 2, barWidth, barHeight);
				x += barWidth + 1;
			}
      	},
      	// insert between visualiser and masterGain
		initialize: function() {
			this.rack.analyzer = this.rack.context.createAnalyser();
			this.rack.visualiser.disconnect(this.rack.masterGain);
			this.rack.visualiser.connect(this.rack.analyzer);
			this.rack.analyzer.connect(this.rack.masterGain);
			this.rack.analyzer.fftSize = 64;
			this.bufferLength = this.rack.analyzer.frequencyBinCount;
			this.dataArray = new Uint8Array(this.bufferLength);
			this._super();
		}
	});

	return new Analyzer();
});

