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
			var scale = this.height() - 14 / 2;
			for(var i=0;i<this.rack.buffer.length;i++) {
				var height = this.baseline + this.rack.buffer[i] * scale;
				this.context.fillRect(i, height, 1, 1);
			}

		},
	});

	return new Visualiser();
});
