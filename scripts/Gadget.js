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

			var container = document.createElement('div');
			var titleBar = document.createElement('h4');

			this.container = container;
			container.className = 'gadget';
			titleBar.className = 'titlebar';

			container.appendChild(titleBar);
			container.appendChild(this.canvas);

			var title = document.createTextNode(this.title);
			titleBar.appendChild(title);
			this.parent.appendChild(container);

			this.canvas.setAttribute('height', this.height());
			this.canvas.setAttribute('width', this.container.offsetWidth);

			this.context = this.canvas.getContext('2d');

			this.baseline = this.canvas.height / 2;

			var color = 'rgb(119, 119, 119)';
			this.context.fillStyle = color;
			this.context.font = "12px Arial, sans-serif";
			this.context.strokeStyle = color;

			// events
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

		addButton: function(icon, handler, options) {
			var options = options || {
				type: 'checkbox'
			};

			var titleBar = this.container.querySelector('.titlebar');
			var iconElement = document.createElement('i');
			iconElement.className = icon;

			var button = document.createElement('button');
			button.className = 'btn btn-sm btn-primary';
			button.appendChild(iconElement);
			titleBar.appendChild(button);

			button.onclick = function() {

				if(iconElement.className.match(/\btext-danger\b/)) {
					iconElement.className =
						iconElement.className.replace(/\btext-danger\b/, '');
					handler(false);
				} else {
					iconElement.className += ' text-danger';
					handler(true);
				}
			}
		},

		clear: function() {
			this.context.clearRect(
				0, 0, this.canvas.width, this.canvas.height);
			this.context.fillStyle = 'rgb(119, 119, 119)';
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
