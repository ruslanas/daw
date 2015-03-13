/*
 * Buffer visualiser
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

define('plugins/visualiser', ['Gadget'], function(Gadget) {

	// Gadget class
	var Visualiser = Gadget.extend({

		_letters: null,

		init: function() {
			this._super();
			this.title = 'Visualizer';
			this._letters = '0123456789ABCDEF'.split('');
		},

		redraw: function() {

			this.clear();

		    var color = '#';
		    for (var i = 0; i < 6; i++ ) {
		        color += this._letters[Math.floor(Math.random() * 16)];
		    }

		    this.context.fillStyle = 'rgb(119, 119, 119)';
			this.context.fillText(
				'Buffer size: ' + this.rack.recordFrameLen, 0, this.canvas.height);

		    this.context.fillStyle = color;

			var scale = (this.canvas.height - 14) / 2;

			for(var i=0;i<this.rack.buffer.length;i++) {
				var amp = this.rack.buffer[i];
				var height = this.baseline + amp * scale;
				this.context.fillRect(i, height, 1, 1);
			}

		},
	});

	return new Visualiser();
});
