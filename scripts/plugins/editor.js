/**
 * Wave Editor
 * Modular Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/editor', [
	'Gadget',
	], function(Gadget) {

	var Editor = Gadget.extend({

		markerPos: 0,
		markerEnd: 0,
		start: 0,
		zoom: 128,
		select: false,
		stopButton: null,

		init: function() {
			this._super();

			this.title = 'Recorder';
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

			// frame number
			this.context.fillText(
				'Pos: ' + this.start + ' Zoom: ' + this.zoom + ' Val: '
					+ this.getSample(this.markerPos),
				2, this.canvas.height - 2);

			this.context.fillStyle = '#F00';
			var from = (this.markerPos - this.start) / this.zoom;
			this.context.fillRect(from, 0, 1, this.height());

			this.context.fillStyle = '#00F';
			var to = (this.markerEnd - this.start) / this.zoom;
			this.context.fillRect(to, 0, 1, this.height());

			this.context.globalAlpha = 0.1;
			this.context.fillRect(from,
				0, to - from, this.height());


		},

		onMouseDown: function(event) {
			this.stopButton.click();
			var x = this.getX(event);
			this.select = true;
			this.markerPos = Math.round(this.start + x * this.zoom);
		},

		onMouseMove: function(event) {
			if(this.select) {
				this.markerEnd = Math.round(this.start + this.getX(event) * this.zoom);
			}
		},

		onMouseUp: function(event) {
			if(!this.select) {
				return;
			}
			var x = this.getX(event);
			this.select = false;
			this.markerEnd = Math.round(this.start + x * this.zoom);

			// swap
			if(this.markerPos > this.markerEnd) {
				var tmp = this.markerEnd;
				this.markerEnd = this.markerPos;
				this.markerPos = tmp;
			}
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
			this.markerEnd = this.rack.sample.length;
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

			this.addButton('glyphicon glyphicon-record', function(on) {
				if(self.rack.onAir) {
					self.rack.pause();
				} else {
					self.rack.record();
				}
			});

			this.stopButton = this.addButton('glyphicon glyphicon-stop', function(on) {

				self.rack.pause();
			});
			this.addButton('glyphicon glyphicon-play', function(on) {
				var from = self.markerPos / self.rack.context.sampleRate;
				var duration = (self.markerEnd - self.markerPos) / self.rack.context.sampleRate;
				self.rack.play(from, duration);
			});
			this.addButton('glyphicon glyphicon-cloud-upload', function(on) {
                self.rack.upload();
			});
		}
	});

	return Editor;
});

