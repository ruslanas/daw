define('daw', ['jquery'], function($) {


	var daw = {
		gadgets: [],
		context: new AudioContext(),
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

		plug: function(selector, gadget) {
			this.gadgets.push(gadget);
			gadget.connect(selector, this);
		},

		pause: function() {
			this.onAir = false;
			if(this.stream) {
				this.stream.stop();
				this.stream = null;
			}

			this.recorder.disconnect(this.visualiser);

			if(this.player) {
				this.player.stop();
				this.player.disconnect(this.visualiser);
			}

			// Update GUI
			$('#pause-btn').attr('disabled', 'disabled');
			$('#play-btn').removeAttr('disabled');
			$('#record-btn').removeAttr('disabled');

		},

		play: function () {
			$('#pause-btn').removeAttr('disabled');
			$('#play-btn').attr('disabled', 'disabled');
			$('#record-btn').attr('disabled', 'disabled');

			this.masterGain.gain.value = 1;
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
				self.recorder.connect(self.visualiser);
			}, function(err) {
				alert(err);
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
			this.visualiser = this.context.createScriptProcessor(this.recordFrameLen, 1, 1);

			// update visualiser buffer
			this.visualiser.onaudioprocess = function(e) {

				self.buffer = e.inputBuffer.getChannelData(0);
				var output = e.outputBuffer.getChannelData(0);
				output.set(self.buffer);
			};

			this.recorder = this.context.createScriptProcessor(
				this.recordFrameLen, 1, 1);

			this.recorder.onaudioprocess = function(e) {
				var input = e.inputBuffer.getChannelData(0);

				var output = e.outputBuffer.getChannelData(0);
				// bypass
				output.set(input);
				// add frame to buffer
				self.appendFrame(output, self.recordFrameLen);
			};

			this.micGain = this.context.createGain();
			this.micGain.gain.value = 0.3;
			this.micGain.connect(this.recorder);

			this.masterGain = this.context.createGain();
			self.visualiser.connect(self.masterGain);
			self.masterGain.connect(self.context.destination);

		},

		initialize: function () {

			var self = this;

			// allocate memory for track
			this.sampleBuffLen = this.context.sampleRate * 10;
			this.sample = new Float32Array(this.sampleBuffLen);

			$('#record-btn').click(function() {
				self.record();
			});

			$('#pause-btn').click(function() {
				self.pause();
			});

			$('#play-btn').click(function() {
				self.play();
			});

			$(window).bind('wheel', function(e) {
				var newPos = parseInt(self.pos) - parseInt(e.originalEvent.deltaY / 100);
				if(e.ctrlKey) {
					self.step = (self.step > 0) ? self.step + e.originalEvent.deltaY / 100 : 1;
				} else {
					self.pos = newPos;
				}
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
		}

	};

	return daw;
});
