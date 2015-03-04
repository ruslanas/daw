/*
Gadget is connected to GUI canvas. It is responsible
for redrawing itself.
*/

define('editor', ['jquery', 'Gadget'], function($, Gadget) {

	// Gadget class
	var Editor = Gadget.extend({
		redraw: function() {
			var m = 0, step = this.rack.step;
			var sample = this.rack.sample;

			this.context.clearRect(0, 0,
				this.canvas.width,
				this.canvas.height);

			var pos = $('#frame').val();

			for(var i=0;i<this.canvas.width * step; i+=2) {
				// magic number frame size
				var amp = 655.35 * sample[pos * 4096 - m] / 2;
				this.context.fillRect(
					this.canvas.width - i,
					this.canvas.height / 2, 1, amp + 1);
				m += step;
			}

		},
	});

	return new Editor();
});

