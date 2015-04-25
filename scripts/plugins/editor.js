/**
 * Wave Editor
 * Modular Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/editor', [
	'Gadget'
	], function(Gadget) {

	var Editor = Gadget.extend({

		markerPos: 0,
		markerEnd: 0,
		start: 0,
		scaleY: 0,
		zoom: 128,
		select: false,
		stopButton: null,
		help: "To record audio from master output click record button in main control panel.",

		init: function() {
			this._super();

			this.title = 'Recorder';
			this.height(100);
		},

		getSample: function(idx) {
			return this.rack.sample[idx];
		},

		update: function() {
			if(this.rack.onAir) {
				this.start = Math.max(0,
					this.rack.pos * this.rack.recordFrameLen - this.canvas.width * this.zoom);
				this.updateStatus();
				this.updated = true;
			}
		},

		redraw: function() {

			this.clear();

			var len = this.canvas.width * this.zoom;

			for(var i=0;i<this.canvas.width;i++) {
				var idx = this.start + i * this.zoom;
				var amp = this.getSample(idx) * this.scaleY;
				this.context.fillRect(i, this.baseline, 0.7, amp + 1);
			}

			// frame number
			this.context.fillText(this.status, 2, this.canvas.height - 2);

			this.context.fillText('Loop start: ' + (this.markerPos / this.audio.sampleRate).toFixed(6), 2, this.canvas.height - 22);
			this.context.fillText('Loop end: ' + (this.markerEnd / this.audio.sampleRate).toFixed(6), 2, this.canvas.height - 12);

			this.context.fillStyle = '#F00';
			var from = (this.markerPos - this.start) / this.zoom;
			this.context.fillRect(from, 0, 1, this.height());

			this.context.fillStyle = '#00F';
			var to = (this.markerEnd - this.start) / this.zoom;
			this.context.fillRect(to, 0, 1, this.height());

			this.context.globalAlpha = 0.1;
			this.context.fillRect(from,
				0, to - from, this.height());

			this.updated = false;
		},

		onMouseDown: function(event) {
			this.stopButton.click();
			var x = this.getX(event);
			this.select = true;
			this.markerPos = Math.round(this.start + x * this.zoom);
			this.updateStatus();
			this.updated = true;
		},

		onMouseMove: function(event) {
			if(this.select) {
				this.markerEnd = Math.round(this.start + this.getX(event) * this.zoom);
			}
			this.updateStatus();
			this.updated = true;
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

			this.updateStatus();
			this.updated = true;
		},

		updateStatus: function() {
			this.setStatus(
				'Pos: ' + this.start + ' Zoom: ' + this.zoom
				+ ' Length: ' + this.rack.sample.length / this.audio.sampleRate);
		},

		onMouseWheel: function(event) {
			event.preventDefault();
			event.stopPropagation();

			var delta = -event.deltaY;

			if(event.ctrlKey) {
				// zoom
				var mult = (delta < 0) ? 0.5 : 2;
				this.zoom = Math.max(1, this.zoom * mult);
				this.zoom = Math.min(this.zoom,
					Math.pow(2,
						Math.floor(
							Math.log2(
								this.rack.sample.length / this.canvas.width))));


			} else {
				// scroll
				this.start = Math.max(
					0,
					this.start + this.zoom * delta * this.canvas.width / 4);
				this.start = Math.min(this.start,
					this.rack.sample.length - this.canvas.width * this.zoom);

				this.start = Math.round(this.start);

			}
			this.updateStatus();
			this.updated = true;
		},

		onDrop: function(e) {
			var reader = new FileReader();
			var f = e.dataTransfer.files[0];
			var self = this;
			reader.onloadend = function(ev) {
				var buffer = ev.target.result;
				self.audio.decodeAudioData(buffer, function(buff) {
					self.rack.sample = buff.getChannelData(0);
				});

			};
			reader.readAsArrayBuffer(f);
		},

		initialize: function() {
			this._super();

			var self = this;

			this.canvas.addEventListener('drop', function(e) {
				e.stopPropagation();
				e.preventDefault();
				self.onDrop(e);
			}, false);

			this.canvas.addEventListener('dragover', function(e) {
				e.stopPropagation();
				e.preventDefault();
				e.dataTransfer.dropEffect = 'copy';
			}, false);

			this.scaleY = this.height() / 2;
			//this.markerEnd = this.rack.sample.length;
			this.markerEnd = this.markerPos;
			this.rack.addButton('fa fa-microphone-slash', function(on, button) {

				if(on) {
					button.querySelector('i').className = 'fa fa-microphone-slash';
				} else {
					button.querySelector('i').className = 'fa fa-microphone';
				}

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
			});

			this.rack.addButton('glyphicon glyphicon-record', function(on, button) {
				if(self.rack.onAir) {
					button.style.color = 'white';
					self.rack.pause();
				} else {
					button.style.color = 'red';
					self.rack.record();
				}
			});

			this.stopButton = this.addButton('glyphicon glyphicon-stop', function(on) {

				self.rack.pause();
			}, {
				tooltip: "Stop playback of recorded audio."
			});

			this.addButton('glyphicon glyphicon-play', function(on) {
				var from = self.markerPos / self.rack.context.sampleRate;
				var duration = (self.markerEnd - self.markerPos) / self.rack.context.sampleRate;
				self.rack.play(from, duration);
			}, {
				tooltip: "Play recorder audio."
			});

			this.addButton('glyphicon glyphicon-cloud-upload', function(on) {
                self.rack.upload();
			}, {
				tooltip: "Upload recorded sound to server."
			});

			this.updateStatus();
		}
	});

	return Editor;
});

