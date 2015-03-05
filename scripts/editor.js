/*
Waveform examiner
*/

define('editor', ['Gadget'], function(Gadget) {

	// Gadget class
	var Editor = Gadget.extend({
		init: function() {
			this.title = 'Wave editor';
		},
		redraw: function() {
			var m = 0, step = this.rack.step;

			this.clear();

			var pos = this.rack.pos;
			var h = this.canvas.height / 2;
			var len = this.canvas.width * step;
			for(var i=0;i<len;i+=2) {
				// max = canvas.height - titlebar.height
				var amp = 88 * this.rack.sample[pos * this.rack.recordFrameLen - m];
				this.context.fillRect(this.canvas.width - i, h + amp, 1, 1);
				m += step;
			}
			this.context.fillText(pos, 5, this.canvas.height - 10);

		},
	});

	return new Editor();
});

