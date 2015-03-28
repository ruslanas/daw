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
		color: 'rgb(119, 119, 119)',

		// Constructor. No DOM operations here
		init: function() {
			this.width(256);
			this.height(100);
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
			var titleBar = document.createElement('h5');

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

			this.context.fillStyle = this.color;
			this.context.strokeStyle = this.color;

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
            this.canvas.onmousemove = function(event) {
            	self.onMouseMove(event);
            };
			$(this.canvas).on('mousewheel', function(event) {
				self.onMouseWheel(event);
			});
		},

        getX: function(event) {
            return event.clientX - $(this.canvas).offset().left;
        },

        getY: function(event) {
            return this.canvas.height - (event.clientY - $(this.canvas).offset().top + $('body').scrollTop());
        },

		addButton: function(icon, handler, options) {
			var options = options || {
				type: 'radio',
				group: 'group'
			};

			var titleBar = this.container.querySelector('.titlebar');
			var iconElement = document.createElement('i');
			iconElement.className = icon;

			var button = document.createElement('button');
			button.className = 'btn btn-sm btn-primary';
			button.appendChild(iconElement);
			titleBar.appendChild(button);

			if(options.type === 'radio') {
				button.setAttribute('data-group', options.group);
			}

			if(options.type === 'checkbox') {
				button.setAttribute('data-class', options.checked || '');
			}

			button.onclick = function() {

				var icn = this.querySelector('i');

				// radio?
				if(this.hasAttribute('data-group')) {
					var selector = 'button[data-group="'
						+ this.getAttribute('data-group') + '"]';
					var buttons =
						this.parentNode.querySelectorAll(selector);

					for(var i=0;i<buttons.length;i++) {
						buttons[i].removeAttribute('disabled');
					}

					this.setAttribute('disabled', 'disabled');
					handler(true);

				} else if(this.hasAttribute('data-checked')) {

					var currState = icn.className;
					icn.className = this.getAttribute('data-class');
					this.setAttribute('data-class', currState);

					this.removeAttribute('data-checked');
					handler(false);
				} else {
					var currState = icn.className;
					icn.className = this.getAttribute('data-class');
					this.setAttribute('data-class', currState);

					this.setAttribute('data-checked', 'checked');
					handler(true);
				}
			}

			return button;
		},

		clear: function() {
			this.context.globalAlpha = 1;
			this.context.clearRect(
				0, 0, this.canvas.width, this.canvas.height);
			this.context.fillStyle = this.color;
		},

		update: function() {
			// void
		},

		redraw: function() {
			// void
		},

		// do not call from plugins
		attach: function(container, rack, options) {
			this.title = options.title || this.title;
			this.parent = document.querySelector(container);
			this.options = options;
			this.rack = rack;
			this.audio = this.rack.context;
			this.initialize();
		},

		getSampleRate: function() {
			return this.rack.context.sampleRate;
		}
	});

	return Gadget;
});
