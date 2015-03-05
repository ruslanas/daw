define('daw', ['jquery'], function($) {


	var daw = {
		gadgets: [],
		context: new AudioContext(),
		buffer: new Float32Array(),
		sampleBuffLen: 44100 * 10,
		sample: null,
		canvas: null,
		ctx: null,
		visualiser: null,
		mic: null,
		recorder: null,
		player: null,
		pos: 0,
		coef: 65535 / 200,
		recordFrameLen: 2048,
		step: 16,

		plug: function(selector, gadget) {
			this.gadgets.push(gadget);
			gadget.connect(selector, this);
		},

		pause: function() {
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

			this.masterGain.gain.value = 0.5;
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

			if(!this.mic) {
				var self = this;
				navigator.getUserMedia({audio: true}, function(stream) {

					self.mic = self.context.createMediaStreamSource(stream);
					self.micGain = self.context.createGain();

					self.mic.connect(self.micGain);
					self.micGain.gain.value = 0.5;
					self.micGain.connect(self.recorder);
					self.recorder.connect(self.visualiser);

				}, function(err) {
					alert(err);
				});
			} else {
				this.recorder.connect(this.visualiser);
			}

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
			this.visualiser = this.context.createScriptProcessor(512, 1, 1);

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

				// add frame to buffer
				self.appendFrame(input, self.recordFrameLen);

				var output = e.outputBuffer.getChannelData(0);
				output.set(input);
			};

			this.masterGain = this.context.createGain();
			self.visualiser.connect(self.masterGain);
			self.masterGain.connect(self.context.destination);

		},

		initialize: function () {

			var self = this;

			// allocate memory for track
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
