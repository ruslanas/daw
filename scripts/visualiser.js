/*
Visualises current frame
*/

define('visualiser', ['Gadget'], function(Gadget) {

	// Gadget class
	var Visualiser = Gadget.extend({
		redraw: function() {

			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			var h = this.canvas.height / 2;

			for(var i=0;i<this.rack.buffer.length;i++) {
				var height = this.rack.buffer[i] * this.rack.coef;
				this.context.fillRect(i, h + height, 1, 1);
			}

		},
	});

	return new Visualiser();
});
