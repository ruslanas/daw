/**
 * Wave Editor
 * Modular Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

define('plugins/editor', [
	'Gadget',
	'jquery',
	'jquery-mousewheel'
	], function(Gadget, $) {

	var Editor = Gadget.extend({

		markerPos: -1,
		start: 0,
		zoom: 128,

		init: function() {
			this._super();
			this.title = 'Wave editor';
			this.width(512);
			this.height(150);
		},

		getSample: function(idx) {
			return this.rack.sample[idx];
		},

		update: function() {
		},

		redraw: function() {

			this.clear();

			this.zoom = Math.min(this.zoom,
				Math.pow(2,
					Math.floor(
						Math.log2(
							this.rack.sample.length / this.canvas.width))));

			if(this.rack.onAir) {
				this.start = Math.max(0,
					this.rack.pos * this.rack.recordFrameLen - this.canvas.width * this.zoom);
			}

			this.start = Math.min(this.start,
				this.rack.sample.length - this.canvas.width * this.zoom);
			var len = this.canvas.width * this.zoom;
			var scaleY = -(this.height() - 14 / 2);

			for(var i=0;i<this.canvas.width;i++) {
				var idx = this.start + i * this.zoom;
				var amp = this.getSample(idx) * scaleY;
				this.context.fillRect(i, this.baseline, 1, amp + 1);
			}


			this.context.fillRect(
				this.markerPos, this.titleHeight, 1, this.height());

			// frame number
			this.context.fillText(
				'Pos: ' + this.start + ' Zoom: ' + this.zoom,
				0, this.canvas.height);

		},

		onMouseDown: function(event) {
			this.markerPos = event.clientX - $(this.canvas).offset().left - 1;
		},

		onMouseWheel: function(event) {
			event.preventDefault();
			event.stopPropagation();

			var delta = event.deltaY;

			if(event.ctrlKey) {
				// zoom
				var mult = (delta < 0) ? 0.5 : 2;
				this.zoom = Math.max(1, this.zoom * mult);

			} else {
				// scroll
				this.start = Math.max(
					0,
					this.start + this.zoom * delta * this.canvas.width / 4);
			}
		},

		initialize: function() {
			this._super();
			this.context.fillStyle = '#369';

			// respond to mousewheel
			var self = this;
			$(this.canvas).on('mousewheel', function(event) {
				self.onMouseWheel(event);
			});
		}
	});

	return new Editor();
});

