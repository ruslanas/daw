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

			for(var i=0;i<this.canvas.width;i++) {
				var amp = this.rack.buffer[i];
				var height = this.baseline + amp * this.scale;
				this.context.fillRect(i, height, 1, 1);
			}
		},

		initialize: function() {
			this._super();
			this.scale = this.height() / 2;
			this.parent.querySelector('.titlebar').innerHTML += ' (' + this.rack.recordFrameLen + ')';
		}
	});

	return Visualiser;
});
