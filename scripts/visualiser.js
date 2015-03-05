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
			// 43 - vertical center
			for(var i=0;i<this.rack.buffer.length;i++) {
				var height = 57 + this.rack.buffer[i] * 86;
				this.context.fillRect(i, height, 1, 1);
			}

		},
	});

	return new Visualiser();
});
