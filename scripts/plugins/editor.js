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
			this.height(150);
		},
		redraw: function() {
			var m = 0, step = this.rack.step;

			this.clear();

			var pos = this.rack.pos;
			var len = this.canvas.width * step;

			var scale = this.height() - 14 / 2;
			// optimize this
			for(var i=0;i<len;i++) {
				var amp = scale *
					this.rack.sample[pos * this.rack.recordFrameLen - m];

				this.context.fillRect(this.canvas.width - i,
					this.baseline, 1, amp + 1);
				m += step;
			}

			// frame number
			this.context.fillText(
				'Frame: ' + pos + ' Step: ' + step +
				' Mouse wheel +- CTRL scroll/zoom',
				0, this.canvas.height);

		},
		initialize: function() {
			this._super();
			this.context.fillStyle = '#369';
			this.context.font = '12px "Open Sans"';
		}
	});

	return new Editor();
});

