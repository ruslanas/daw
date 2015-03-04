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
		recordFrameLen: 4096,
		step: 16,

		plug: function(selector, gadget) {
			this.gadgets.push(gadget);
			gadget.connect(selector, this);
		},

		pause: function() {
			this.recorder.disconnect(this.visualiser);

			if(this.player) {
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
			this.rewind();

			$('#record-btn').attr('disabled', 'disabled');
			$('#pause-btn').removeAttr('disabled');

			this.recorder.connect(this.visualiser);

		},

		appendFrame: function(buff, length) {
			var end = length * this.pos;
			if(end + length > this.sampleBuffLen) {
				this.pause();
				return;
			}

			this.sample.set(buff, end);
			$('#frame').val(this.pos);
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
		},

		initialize: function () {

			var self = this;

			// allocate memory for track
			this.sample = new Float32Array(this.sampleBuffLen);

			this.canvas = document.getElementById('canvas');
			this.ctx = this.canvas.getContext('2d');
			this.ctx.fillStyle = '#FF0';

			$('#record-btn').click(function() {
				self.record();
			});

			$('#pause-btn').click(function() {
				self.pause();
			});

			$('#play-btn').click(function() {
				self.play();
			});

			$('#frame').change(function() {
				self.pos = $(this).val();
			});

			$(window).bind('wheel', function(e) {
				var newPos = parseInt(self.pos) - parseInt(e.originalEvent.deltaY / 100);
				if(e.ctrlKey) {
					self.step = (self.step > 0) ? self.step + e.originalEvent.deltaY / 100 : 1;
				} else {
					$('#frame').val(newPos).change();
				}
				return false;
			});

			navigator.getUserMedia({audio: true}, function(stream) {

				self.mic = self.context.createMediaStreamSource(stream);
				self.mic.connect(self.recorder);

				self.visualiser.connect(self.context.destination);

			}, function(err) {
				console.log(err);
			});

			this.createProcessors();

			setInterval(function() {
				self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

				var h = self.canvas.height / 2;

				for(var i=0;i<self.buffer.length;i++) {
					var height = self.buffer[i] * self.coef;
					self.ctx.fillRect(i, h + height, 1, 1);
				}

				for(var i=0;i<self.gadgets.length;i++) {
					self.gadgets[i].redraw();
				}

			}, 1000 / 30);

		}
	};

	return daw;
});

