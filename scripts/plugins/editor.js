/*
 * Modular Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

define('plugins/editor', ['Gadget', 'jquery', 'jquery-mousewheel'], function(Gadget, $) {

	// Gadget class
	var Editor = Gadget.extend({

		init: function() {
			this._super();
			this.title = 'Wave editor';
			this.width(512);
			this.height(150);
		},

		redraw: function() {
			var m = 0, step = this.rack.step;

			this.clear();

			var pos = this.rack.pos;
			var len = this.canvas.width * step;

			var scale = this.height() - 14 / 2;
			// optimize this
			for(var i=0;i<len;i++) {
				var amp = scale *
					this.rack.sample[pos * this.rack.recordFrameLen - m];

				this.context.fillRect(this.canvas.width - i,
					this.baseline, 1, amp + 1);
				m += step;
			}

			// frame number
			this.context.fillText(
				'Frame: ' + pos + ' Step: ' + step +
				' Mouse wheel +- CTRL scroll/zoom',
				0, this.canvas.height);

		},

		initialize: function() {
			this._super();
			this.context.fillStyle = '#369';
			this.context.font = '12px "Open Sans"';

			// respond to mousewheel
			var self = this;
			$(this.canvas).on('mousewheel', function(event) {
				event.preventDefault();
				event.stopPropagation();

				var delta = event.deltaY;
				var newPos = parseInt(self.rack.pos) - delta;

				if(event.ctrlKey) {

					self.rack.step = Math.max(1, self.rack.step + delta);

				} else {

					self.rack.pos = Math.max(1, newPos);

				}

				return false;
			});
		}
	});

	return new Editor();
});

