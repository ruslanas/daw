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
			// do not interrupt recording
			if(this.rack.onAir) {
				return;
			}
			var m = 0, step = this.rack.step;

			this.clear();

			var pos = this.rack.pos;
			var len = this.canvas.width * step;
			// optimize this
			for(var i=0;i<len;i+=2) {
				var amp = 57 + 86 * this.rack.sample[pos * this.rack.recordFrameLen - m];
				this.context.fillRect(this.canvas.width - i, amp, 2, 1);
				m += step;
			}
			this.context.fillText(pos, 5, this.canvas.height - 10);

		},
	});

	return new Editor();
});

