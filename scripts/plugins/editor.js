/**
 * Wave Editor
 * Modular Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/editor', [
	'Gadget',
	'jquery'
	], function(Gadget, $) {

	var Editor = Gadget.extend({

		markerPos: 10,
		start: 0,
		zoom: 128,

		init: function() {
			this._super();

			this.title = 'Recorder';
			this.width(512);
			this.height(100);
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

			this.start = Math.round(this.start);

			var len = this.canvas.width * this.zoom;
			var scaleY = this.height() / 2;

			for(var i=0;i<this.canvas.width;i++) {
				var idx = this.start + i * this.zoom;
				var amp = this.getSample(idx) * scaleY;
				this.context.fillRect(i, this.baseline, 0.7, amp + 1);
			}

			this.context.fillStyle = '#FFF';

			this.context.fillRect(
				(this.markerPos - this.start) / this.zoom,
				0, 0.5, this.height());

			// frame number
			this.context.fillText(
				'Pos: ' + this.start + ' Zoom: ' + this.zoom + ' Val: '
					+ this.getSample(this.markerPos),
				0, this.canvas.height);

		},

		onMouseDown: function(event) {
			var x = event.clientX - $(this.canvas).offset().left - 1;
				// - getComputedStyle(this.canvas, null)
				// 	.getPropertyValue('border-left-width').replace('px', '');
			this.markerPos = Math.round(this.start + x * this.zoom);
		},

		onMouseWheel: function(event) {
			event.preventDefault();
			event.stopPropagation();

			var delta = -event.deltaY;

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
			var self = this;
			this.addButton('glyphicon glyphicon-record', function(on) {
				if(self.rack.onAir) {
					self.rack.pause();
				} else {
					self.rack.record();
				}
			});

			this.addButton('fa fa-microphone-slash', function(on) {

                if(self.rack.micGain.gain.value > 0) {
                    self.rack.micGain.gain.value = 0;

                    if(self.rack.stream) {
                        self.rack.stream.stop();
                        self.rack.stream = null;
                    }

                } else {

                    navigator.getUserMedia({audio: true}, function(stream) {
                        self.rack.stream = stream;
                        self.rack.mic =
                        	self.rack.context.createMediaStreamSource(stream);
                        self.rack.mic.connect(self.rack.micGain);
                        self.rack.micGain.gain.value = 0.4;

                    }, function(err) {
                        self.rack.setStatus('User media not available');
                    });

                }
			}, {
				type: 'checkbox',
				checked: 'fa fa-microphone'
			});

			this.addButton('glyphicon glyphicon-stop', function(on) {

				self.rack.pause();
			});
			this.addButton('glyphicon glyphicon-play', function(on) {
				self.rack.play();
			});
			this.addButton('glyphicon glyphicon-cloud-upload', function(on) {
                self.rack.upload();
			});
			this.addButton('glyphicon glyphicon-volume-up', function(on) {
                if(self.rack.getVolume()) {
                    self.rack.mute();
                } else {
                    self.rack.setVolume(1);
                }
			}, {
				type: 'checkbox',
				checked: 'glyphicon glyphicon-volume-off'
			});
		}
	});

	return Editor;
});

