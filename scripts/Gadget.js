/**
 * Gadget Base Class
 * @author Ruslanas Balciunas
 */

define('Gadget', ['Class'], function() {

	var Gadget = Class.extend({

		_width: 0,
		_height: 0,
		title: '',

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

		initialize: function() {

			var self = this;

			this.canvas = document.createElement('canvas');

			this.canvas.setAttribute('height', this.height());
			this.canvas.setAttribute('width', this.width());

			this.parent.appendChild(this.canvas);
			this.context = this.canvas.getContext('2d');

			this.baseline = (this.canvas.height + 14) / 2;

			this.context.fillStyle = '#FFF';
			this.context.font = "12px Arial, sans-serif";
			this.context.fillText(this.title, 5, 12);
			var color = 'rgb(119, 119, 119)';
			this.context.fillStyle = color;
			this.context.strokeStyle = color;

            this.canvas.onmousemove = function(event) {
            	self.onMouseMove(event);
            };
            this.canvas.onclick = function(event) {
            	self.onClick(event);
            };

		},

		clear: function() {
			this.context.clearRect(
				0,
				14,
				this.canvas.width,
				this.canvas.height - 14
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
		}
	});

	return Gadget;
});
