/*
 * Buffer visualiser
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/visualiser', ['Gadget'], function(Gadget) {

	var Visualiser = Gadget.extend({

		init: function() {
			this._super();
			this.title = 'Visualizer';
		},

		redraw: function() {

			this.clear();

			this.context.fillText(
				'Buffer size: ' + this.rack.recordFrameLen, 0, this.canvas.height);

			var scale = (this.canvas.height - this.titleHeight) / 2;

			for(var i=0;i<this.canvas.width;i++) {
				var amp = this.rack.buffer[i];
				var height = this.baseline + amp * scale;
				this.context.fillRect(i, height, 1, 1);
			}

		},
	});

	return Visualiser;
});
