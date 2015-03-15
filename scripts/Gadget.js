/**
 * Gadget Base Class
 * @author Ruslanas Balciunas
 */

define('Gadget', [
		'Class',
		'jquery-mousewheel'
	], function() {

	var Gadget = Class.extend({

		_width: 0,
		_height: 0,
		title: '',
		titleHeight: 14,

		// Constructor. No DOM operations here
		init: function() {
			this.width(256);
			this.height(114);
		},

		width: function(val) {
			this._width = val || this._width;
			return this._width;
		},

		height: function(val) {
			this._height = val || this._height;
			return this._height;
		},

		onMouseMove: function(event) {
			// void
		},

		onClick: function(event) {
			// void
		},

		onMouseDown: function(event) {
			// void
		},

		onMouseUp: function(event) {
			// void
		},

		onMouseWheel: function(event) {
			// void
		},

		initialize: function() {

			var self = this;

			if(!this.title) {
				this.titleHeight = 0;
			}
			this.canvas = document.createElement('canvas');

			this.canvas.setAttribute('height', this.height());
			this.canvas.setAttribute('width', this.width());

			this.parent.appendChild(this.canvas);
			this.context = this.canvas.getContext('2d');

			this.baseline = (this.canvas.height + this.titleHeight) / 2;

			var color = 'rgb(119, 119, 119)';
			this.context.fillStyle = color;
			this.context.font = "12px Arial, sans-serif";
			this.context.fillText(this.title, 5, 12);
			this.context.strokeStyle = color;

            this.canvas.onmousemove = function(event) {
            	self.onMouseMove(event);
            };
            this.canvas.onclick = function(event) {
            	self.onClick(event);
            };
            this.canvas.onmousedown = function(event) {
            	self.onMouseDown(event);
            };
            this.canvas.onmouseup = function(event) {
            	self.onMouseUp(event);
            };
			$(this.canvas).on('mousewheel', function(event) {
				self.onMouseWheel(event);
			});
		},

		clear: function() {
			this.context.clearRect(
				0,
				this.titleHeight,
				this.canvas.width,
				this.canvas.height - this.titleHeight
			);
		},

		update: function() {
			// void
		},

		redraw: function() {
			// void
		},

		// do not call from plugins
		connect: function(container, rack, options) {
			this.title = options.title || this.title;
			this.parent = document.querySelector(container);
			this.options = options;
			this.rack = rack;
			this.initialize();
		},

		getSampleRate: function() {
			return this.rack.context.sampleRate;
		}
	});

	return Gadget;
});
