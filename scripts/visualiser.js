/*
Visualises current frame
*/

define('visualiser', ['Gadget'], function(Gadget) {

	// Gadget class
	var Visualiser = Gadget.extend({
		init: function() {
			this.title = 'Visualizer';
		},
		redraw: function() {

			this.clear();

			var h = this.canvas.height / 2;

			for(var i=0;i<this.rack.buffer.length;i++) {
				var height = h + this.rack.buffer[i] * 88;
				this.context.fillRect(i, height, 1, 1);
			}

		},
	});

	return new Visualiser();
});
