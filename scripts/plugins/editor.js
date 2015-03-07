/*
Waveform examiner
*/

define('plugins/editor', ['Gadget'], function(Gadget) {

	// Gadget class
	var Editor = Gadget.extend({
		init: function() {
			this._super();
			this.title = 'Wave editor';
			this.width(512);
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
				var amp = this.baseline + 86 *
					this.rack.sample[pos * this.rack.recordFrameLen - m];

				this.context.fillRect(this.canvas.width - i, amp, 2, 1);
				m += step;
			}
			this.context.fillText(pos, 5, this.canvas.height - 10);

		},
		initialize: function() {
			this._super();
			this.context.fillStyle = '#F00';
		}
	});

	return new Editor();
});

