/*
Visualises current frame
*/

define('plugins/visualiser', ['Gadget'], function(Gadget) {

	// Gadget class
	var Visualiser = Gadget.extend({
		init: function() {
			this._super();
			this.title = 'Visualizer';
		},
		redraw: function() {

			this.clear();
			// 43 - vertical center
			for(var i=0;i<this.rack.buffer.length;i++) {
				var height = this.baseline + this.rack.buffer[i] * 86;
				this.context.fillRect(i, height, 1, 1);
			}

		},
	});

	return new Visualiser();
});
