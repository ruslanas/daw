/*
Gadget is connected to GUI canvas. It is responsible
for redrawing itself.
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
			for(var i=0;i<this.canvas.width * step; i+=2) {
				// magic number frame size
				var amp = 164 * this.rack.sample[pos * this.rack.recordFrameLen - m] + 1;
				this.context.fillRect(this.canvas.width - i, h + amp, 1, 1);
				m += step;
			}
			this.context.fillText(pos, 5, this.canvas.height - 10);

		},
	});

	return new Editor();
});

