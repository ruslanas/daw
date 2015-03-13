/**
 * Modular Audio Application Framework <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

define('daw', ['jquery'], function($) {

    var daw = {
        gadgets: [],
        context: null,
        buffer: null,
        sampleBuffLen: 0,
        sample: null,
        canvas: null,
        ctx: null,
        visualiser: null,
        mic: null,
        recorder: null,
        player: null,
        pos: 0,
        duration: 5,           // seconds
        recordFrameLen: 256,   // samples
        step: 16,
        onAir: false,
        worker: null,
        bpm: 140,

        plug: function(selector, gadget, options) {
            this.gadgets.push(gadget);
            gadget.connect(selector, this, options || {});
        },

        pause: function() {
            // Update GUI
            $('#save-btn').removeAttr('disabled');
            $('#pause-btn').attr('disabled', 'disabled');
            $('#play-btn').removeAttr('disabled');
            $('#record-btn').css('color', '#FFF');

            this.onAir = false;

            if(this.player) {
                this.player.stop();
                this.player.disconnect(this.visualiser);
                this.player = null;
            }

        },

        play: function () {
            $('#save-btn').attr('disabled', 'disabled');
            $('#pause-btn').removeAttr('disabled');
            $('#play-btn').attr('disabled', 'disabled');

            this.player = this.context.createBufferSource();

            var buff = this.context.createBuffer(1,
                this.sample.length,
                this.context.sampleRate);

            var ch = buff.getChannelData(0);

            ch.set(this.sample);

            this.player.buffer = buff;

            this.player.connect(this.visualiser);

            this.setVolume(1);

            this.player.start();

            var self = this;
            this.player.onended = function() {
                self.pause();
            };
        },

        rewind: function() {
            this.pos = 0;
        },

        mute: function() {
            this.masterGain.gain.value = 0;
            var $i = $('#volume-btn i');
            $i.removeClass('glyphicon-volume-up');
            $i.addClass('glyphicon-volume-off');
        },

        setVolume: function(gain) {
            this.masterGain.gain.value = gain;
            var $i = $('#volume-btn i');
            $i.removeClass('glyphicon-volume-off');
            $i.addClass('glyphicon-volume-up');
        },

        getVolume: function() {
            return this.masterGain.gain.value;
        },

        record: function () {
            this.rewind();

            $('#record-btn').css('color', '#F00');
            $('#play-btn').attr('disabled', 'disabled');
            $('#pause-btn').removeAttr('disabled');

            var self = this;
            this.onAir = true;
            $('#save-btn').attr('disabled', 'disabled');

        },

        appendFrame: function(buff) {
            var length = this.recordFrameLen;
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
            this.recorder.onaudioprocess = function(e) {
                var input = e.inputBuffer.getChannelData(0);

                var output = e.outputBuffer.getChannelData(0);
                // bypass
                output.set(input);
                // add frame to buffer
                if(self.onAir) {
                    self.appendFrame(output);
                }
            };
            self.recorder.connect(self.visualiser);

            this.micGain = audio.createGain();
            this.micGain.gain.value = 0;
            this.micGain.connect(this.recorder);

            this.masterGain = audio.createGain();
            this.visualiser.connect(this.masterGain);
            this.masterGain.connect(this.context.destination);

        },

        initialize: function (options) {

            var self = this;

            // defaults
            // option names lower_case_with_underscores more natural
            this.options = options || {};
            this.duration = options.duration || this.duration;
            this.recordFrameLen = options.buffer_size || this.recordFrameLen;

            this.buffer = new Float32Array();

            this.context = new AudioContext();

            // allocate memory for recorded wave
            this.sampleBuffLen = this.context.sampleRate * this.duration;
            this.sample = new Float32Array(this.sampleBuffLen);

            // decouple
            $('#record-btn').click(function(event) {
                event.stopPropagation();
                event.preventDefault();
                if(self.onAir) {
                    self.pause();
                } else {
                    self.record();
                }
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

            $('#volume-btn').click(function(event) {
                event.stopPropagation();
                event.preventDefault();

                if(self.getVolume()) {
                    self.mute();
                } else {
                    self.setVolume(1);
                }
            });

            $('#save-btn').click(function(event) {
                event.stopPropagation();
                event.preventDefault();

                self.upload();
            });

            $('#mic-btn').click(function(event) {
                event.preventDefault();
                event.stopPropagation();

                if(self.micGain.gain.value > 0) {
                    $(this).css('color', '#FFF');
                    self.micGain.gain.value = 0;

                    if(self.stream) {
                        self.stream.stop();
                        self.stream = null;
                    }

                } else {
                    $(this).css('color', '#F00');

                    navigator.getUserMedia({audio: true}, function(stream) {
                        self.stream = stream;
                        self.mic = self.context.createMediaStreamSource(stream);
                        self.mic.connect(self.micGain);
                        self.micGain.gain.value = 0.4;

                    }, function(err) {
                        self.setStatus('User media not available');
                    });

                }
            });

            $('#save-form').submit(function(event) {
                event.preventDefault();
                event.stopPropagation();
                $(this).removeClass('show');

                self.worker.postMessage({
                    name: $('input[name="name"]').val(),
                    email: $('input[name="email"').val()
                });

            });

            this.createProcessors();

            window.requestAnimationFrame(function() {
                self.redraw();
            });

            setInterval(function() {
                for(var i=0;i<self.gadgets.length;i++) {
                    self.gadgets[i].update();
                }
            }, 1000 * 60 / this.bpm); // BPM
        },

        setStatus: function(msg) {
            $('#message').html(msg);
        },

        upload: function() {
            var self = this;
            self.setStatus('Preparing...');

            $('#save-btn').attr('disabled', 'disabled');

            self.worker = new Worker('scripts/mp3Worker.js');
            self.worker.postMessage('hi');
            self.worker.addEventListener('message', function(e) {
                switch(e.data) {
                    case 'ready':
                        self.worker.postMessage(self.sample);
                        break;

                    case 'encoded':
                        var msg = 'Done encoding. Fill form on the right';
                        self.setStatus(msg);
                        $('#save-form').addClass('show');
                        break;

                    case 'done':
                        self.setStatus('Done');
                        $('#save-btn').attr('disabled', 'disabled');
                        self.load();
                        break;
                    default:
                        self.setStatus(e.data);
                };
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

        load: function(url, done) {
            var self = this;
            this.onload = done || this.onload || function() {
                return false;
            };

            $.getJSON(url, {}, function(data) {
                self.onload(data);
            });
        }

    };

    return daw;
});
