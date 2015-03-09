/**
 * Modular Audio Application Framework <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

define('daw', ['jquery', 'jquery-mousewheel'], function($) {

	var daw = {
		gadgets: [],
		context: null,
		buffer: new Float32Array(),
		sampleBuffLen: 0,
		sample: null,
		canvas: null,
		ctx: null,
		visualiser: null,
		mic: null,
		recorder: null,
		player: null,
		pos: 0,
		recordFrameLen: 2048,
		step: 16,
		onAir: false,
		worker: null,

		plug: function(selector, gadget, options) {
			this.gadgets.push(gadget);
			gadget.connect(selector, this, options || {});
		},

		pause: function() {
			// Update GUI
			$('#save-btn').removeAttr('disabled');
			$('#pause-btn').attr('disabled', 'disabled');
			$('#play-btn').removeAttr('disabled');
			$('#record-btn').removeAttr('disabled');

			this.onAir = false;
			if(this.stream) {
				this.stream.stop();
				this.stream = null;
			}

			this.recorder.disconnect(this.visualiser);
			this.recorder.onaudioprocess = null;

			if(this.player) {
				this.player.stop();
				this.player.disconnect(this.visualiser);
			}

		},

		play: function () {
			$('#save-btn').attr('disabled', 'disabled');
			$('#pause-btn').removeAttr('disabled');
			$('#play-btn').attr('disabled', 'disabled');
			$('#record-btn').attr('disabled', 'disabled');

			this.masterGain.gain.value = 0.777;
			this.player = this.context.createBufferSource();

			this.player.buffer = this.context.createBuffer(1,
				this.sample.length,
				this.context.sampleRate);

			var ch = this.player.buffer.getChannelData(0);

			ch.set(this.sample);

			this.player.connect(this.visualiser);

			this.player.start(0);

			var self = this;
			this.player.onended = function() {
				self.pause();
			};
		},

		rewind: function() {
			this.pos = 0;
		},

		record: function () {
			this.masterGain.gain.value = 0;
			this.rewind();

			$('#record-btn').attr('disabled', 'disabled');
			$('#play-btn').attr('disabled', 'disabled');
			$('#pause-btn').removeAttr('disabled');

			var self = this;
			navigator.getUserMedia({audio: true}, function(stream) {
				self.onAir = true;
				self.stream = stream;
				self.mic = self.context.createMediaStreamSource(stream);
				self.mic.connect(self.micGain);

				self.recorder.onaudioprocess = function(e) {
					var input = e.inputBuffer.getChannelData(0);

					var output = e.outputBuffer.getChannelData(0);
					// bypass
					output.set(input);
					// add frame to buffer
					self.appendFrame(output, self.recordFrameLen);
				};

				self.recorder.connect(self.visualiser);
				$('#save-btn').attr('disabled', 'disabled');
			}, function(err) {
				$('#message').html('User media not available');
			});
		},

		appendFrame: function(buff, length) {
			var end = length * this.pos;
			if(end + length > this.sampleBuffLen) {
				this.pause();
				return;
			}

			this.sample.set(buff, end);
			this.pos++;
		},

		createProcessors: function() {

			var self = this;
			var audio = this.context;
			var bufferLength = this.recordFrameLen;
			this.visualiser = audio.createScriptProcessor(bufferLength, 1, 1);

			// update visualiser buffer
			this.visualiser.onaudioprocess = function(e) {

				self.buffer = e.inputBuffer.getChannelData(0);
				var output = e.outputBuffer.getChannelData(0);
				output.set(self.buffer);
			};

			this.recorder = audio.createScriptProcessor(
				this.recordFrameLen, 1, 1);

			this.micGain = audio.createGain();
			this.micGain.gain.value = 0.5;
			this.micGain.connect(this.recorder);

			this.masterGain = audio.createGain();
			this.visualiser.connect(this.masterGain);
			this.masterGain.connect(this.context.destination);

		},

		initialize: function (options) {

			var self = this;

			this.options = options || {};

			var duration = options.duration || 10;

			this.context = new AudioContext();

			// allocate memory for track
			this.sampleBuffLen = this.context.sampleRate * duration;
			this.sample = new Float32Array(this.sampleBuffLen);

			$('#record-btn').click(function(event) {
				event.stopPropagation();
				event.preventDefault();
				self.record();
			});

			$('#pause-btn').click(function(event) {
				event.stopPropagation();
				event.preventDefault();
				self.pause();
			});

			$('#play-btn').click(function(event) {
				event.stopPropagation();
				event.preventDefault();
				self.play();
			});

			$('#save-btn').click(function(event) {
				event.stopPropagation();
				event.preventDefault();
				$('#message').html('Saving...');
				$(this).attr('disabled', 'disabled');
				self.worker = new Worker('scripts/mp3Worker.js');
				self.worker.postMessage('hi');
				self.worker.addEventListener('message', function(e) {
					switch(e.data) {
						case 'ready':
							self.worker.postMessage(self.sample);
							break;
						case 'done':
							$('#message').html('Done');
							$('#save-btn').attr('disabled', 'disabled');
							self.load();
							break;
						default:
							$('#message').html(e.data);
					};
				});
				return false;
			});

			this.createProcessors();

			window.requestAnimationFrame(function() {
				self.redraw();
			});

		},

		redraw: function() {
			for(var i=0;i<this.gadgets.length;i++) {
				this.gadgets[i].redraw();
			}
			var self = this;
			window.requestAnimationFrame(function() {
				self.redraw();
			});
		},

		load: function(done) {
			var self = this;
			this.onload = done || this.onload || function() {
				return false;
			};

			$.getJSON('api/songs', {}, function(data) {
				self.onload(data);
			});
		}

	};

	return daw;
});
