/*
Gadget is connected to GUI canvas. It is responsible
for redrawing it's control surface.
*/
define('Gadget', ['Class'], function() {

	// Gadget class
	var Gadget = Class.extend({

		_width: 0,
		_height: 0,

		init: function() {
			this.title = 'Gadget';
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

		initialize: function() {

			this.canvas = document.createElement('canvas');

			this.canvas.setAttribute('height', this.height());
			this.canvas.setAttribute('width', this.width());

			this.parent.appendChild(this.canvas);
			this.context = this.canvas.getContext('2d');

			this.baseline = (this.canvas.height + 14) / 2;

			this.context.fillStyle = '#FFF';
			this.context.font = "12px 'Open Sans'";
			this.context.fillText(this.title, 5, 12);
			this.context.fillStyle = '#FF0';
			this.context.strokeStyle = '#FF0';
		},

		clear: function() {
			this.context.clearRect(
				0,
				14,
				this.canvas.width,
				this.canvas.height - 14
			);
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
