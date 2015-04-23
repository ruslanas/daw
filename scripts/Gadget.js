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
		color: 'rgb(119, 119, 119)',
		status: '',
		updated: false,
        knobs: [],
        help: "Help not available",

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

		onMouseOut: function(event) {
			this.down = false;
		},

		getStyleProperty: function(elm, prop) {
			return getComputedStyle(elm).getPropertyValue(prop);
		},

		initialize: function() {

			var self = this;

			this.canvas = document.createElement('canvas');

			var container = document.createElement('div');
			var titleBar = document.createElement('div');
			var titleElement = document.createElement('h5');
			var buttons = document.createElement('div');
			buttons.className = 'buttons';

			titleBar.appendChild(titleElement);

			this.container = container;

			container.className = 'gadget ' + this.title.toLowerCase().replace(' ', '');

			if(this.options.draggable) {
	    		this.container.className += ' draggable';
	    	}

			titleBar.className = 'titlebar';

			container.appendChild(titleBar);
			// stack
			var stack = document.createElement('div');
			stack.className = 'stack';
			container.appendChild(stack);
			stack.appendChild(this.canvas);

			var title = document.createTextNode(this.title);
			titleElement.appendChild(title);
			titleBar.appendChild(buttons);

			this.parent.appendChild(container);
			stack.style.height = this.height() + 'px';

			this.canvas.setAttribute('height', this.height());

			var bw = parseInt(this.getStyleProperty(this.canvas, 'border-left-width'));
			bw += parseInt(this.getStyleProperty(this.canvas, 'border-right-width'));

			var pad = parseInt(this.getStyleProperty(this.container, 'padding-left'));
			pad += parseInt(this.getStyleProperty(this.container, 'padding-right'));

			var pbw = parseInt(this.getStyleProperty(this.container, 'border-left-width'));
			pbw += parseInt(this.getStyleProperty(this.container, 'border-right-width'));

			this.canvas.className = 'background';
			this.canvas.setAttribute('width', this.container.offsetWidth - bw -pbw - pad);

			this.color = this.getStyleProperty(this.canvas, 'color');

			this.width(this.container.offsetWidth);

			this.context = this.canvas.getContext('2d');

			this.baseline = this.canvas.height / 2;

			this.context.fillStyle = this.color;
			this.context.strokeStyle = this.color;

			var icon = document.createElement('i');
			var btn = document.createElement('button');
			btn.className = 'btn btn-sm btn-default';
			icon.className  = 'glyphicon glyphicon-info-sign';
			btn.appendChild(icon);
			buttons.appendChild(btn);

			btn.onmouseover = function() {
				self.rack.setStatus(self.title + ': ' + self.help);
			};

			// events
            this.canvas.onmouseout = function(event) {
            	self.onMouseOut(event);
            };

            if(typeof(this.onMouseMove) === 'function') {
	            this.canvas.onmousemove = function(event) {
	            	self.onMouseMove(event);
	            };
        	}

            if(typeof(this.onClick) === 'function') {
	            this.canvas.onclick = function(event) {
	            	self.onClick(event);
	            };
        	}

            if(typeof(this.onMouseDown) === 'function') {
	            this.canvas.onmousedown = function(event) {
	            	self.onMouseDown(event);
	            };
	        }

            if(typeof(this.onMouseUp) === 'function') {
	            this.canvas.onmouseup = function(event) {
	            	self.onMouseUp(event);
	            };
	        }

            if(typeof(this.onMouseMove) === 'function') {
	            this.canvas.onmousemove = function(event) {
	            	self.onMouseMove(event);
	            };
	        }

            if(typeof(this.onMouseWheel) === 'function') {
				$(this.canvas).on('mousewheel', function(event) {
					self.onMouseWheel(event);
				});
			}

		    // draggable keyboard
		    if(this.options.draggable) {

			    var tb = this.container.querySelector('.titlebar');

			    tb.addEventListener('mousedown', function(e) {
			        var dx = e.clientX - this.parentNode.offsetLeft;
			        var dy = e.clientY - this.parentNode.offsetTop;

			        self.container.style.zIndex = 2000;
			        var mMove = function(e) {

			            self.container.style.left = (e.clientX - dx) + 'px';
			            self.container.style.top = (e.clientY - dy) + 'px';
			        };

			        window.addEventListener('mousemove', mMove, true);
			        window.addEventListener('mouseup', function(e) {
			        	self.container.style.zIndex = 1050;
			            window.removeEventListener('mousemove', mMove, true);
			        }, true);
			    }, false);
			}

			this.updated = true;
		},

        getX: function(event) {
            return event.clientX - $(this.canvas).offset().left;
        },

        getY: function(event) {
            return event.clientY - $(this.canvas).offset().top + $(window).scrollTop();
        },

        drawKnob: function(knob, val) {
            this.context.beginPath();
            this.context.lineWidth = 3;
            this.context.arc(knob.x, knob.y, knob.radius, 0, Math.PI * 2, false);
            this.context.stroke();
            this.context.beginPath();

            this.context.save();
            this.context.translate(knob.x, knob.y);
            this.context.rotate(val * Math.PI);
            this.context.moveTo(-2, 0);
            this.context.lineTo(-10, 0);
            this.context.stroke();
            this.context.restore();

            this.context.textAlign = 'center';
            this.context.fillText(knob.name, knob.x, knob.y + knob.radius + 15);
        },

		addButton: function(icon, handler, options) {
			var options = options || {
				type: 'radio',
				group: 'group'
			};

			var titleBar = this.container.querySelector('.buttons');
			var iconElement = document.createElement('i');
			iconElement.className = icon;

			var button = document.createElement('button');
			button.className = 'btn btn-sm btn-default';
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

		redraw: function() {
			// void
		},

		setStatus: function(msg) {
			this.status = msg;
		},

		// do not call from plugins
		attach: function(container, rack, options) {

			this.parent = document.querySelector(container);

			this.title = options.title || this.title;
			this.height(options.height);
			this.options = options;

			this.rack = rack;
			this.audio = this.rack.context;
			this.initialize();
		},

        // draw vertical line
        vline: function(x, width, color) {
            color = color || this.color;
            width = width || 1;

            this.context.fillStyle = color;
            this.context.fillRect(x, 0, width, this.height());
        },

        hline: function(y, width, color) {
            color = color || this.color;
            width = width || 1;

            this.context.fillStyle = color;
            this.context.fillRect(0, y, this.width(), width);
        },

        addLayer: function() {
            var layer = document.createElement('canvas');
            this.canvas.parentNode.appendChild(layer);
            layer.className = 'layer';
            layer.width = this.canvas.width;
            layer.height = this.height();
            this.layer = layer;
            this.layerContext = layer.getContext('2d');
        },

		getSampleRate: function() {
			return this.audio.sampleRate;
		}
	});

	return Gadget;
});
