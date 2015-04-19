/**
 * Modular Audio Application Framework <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('daw', ['jquery'], function($) {

    var daw = {
        gadgets: [],
        context: null,
        buffer: null,
        sampleBuffLen: 0,
        sample: null,
        canvas: null,
        visualiser: null,
        mic: null,
        player: null,
        pos: 0,
        duration: 5,           // seconds
        recordFrameLen: 256,   // samples
        updateListeners: [],
        step: 16,
        onAir: false,
        worker: null,
        bpm: 180,
        started: null,

        insert: function(selector, gadget, options) {
            this.gadgets.push(gadget);
            gadget.attach(selector, this, options || {});
            if(gadget.update !== undefined) {
                this.updateListeners.push(gadget);
            }
        },

        pause: function() {

            this.onAir = false;

            if(this.player) {
                this.player.stop();
                this.player.disconnect(this.masterGain);
                this.player.onended = false;
                this.player = null;
            }

        },

        play: function (from, duration) {

            this.player = this.context.createBufferSource();

            var buff = this.context.createBuffer(1,
                this.sample.length,
                this.context.sampleRate);

            var ch = buff.getChannelData(0);

            ch.set(this.sample);

            this.player.buffer = buff;

            this.player.connect(this.masterGain);

            this.setVolume(1);

            this.player.loop = true;
            this.player.loopStart = from;
            this.player.loopEnd = from + duration;

            this.player.start(0, from);

            var self = this;
            this.player.onended = function() {
                self.pause();
            };
        },

        rewind: function() {
            this.pos = 0;
        },

        mute: function() {
            this.setVolume(0);
            var $i = $('#volume-btn i');
            $i.removeClass('glyphicon-volume-up');
            $i.addClass('glyphicon-volume-off');
        },

        setVolume: function(gain) {
            this.masterGain.gain.value = gain;
        },

        getVolume: function() {
            return this.masterGain.gain.value;
        },

        record: function () {
            this.rewind();
            this.onAir = true;
        },

        addButton: function(icon, handler) {
            var panel = document.getElementById('control-panel');
            var iconElement = document.createElement('i');
            iconElement.className = icon;

            var button = document.createElement('button');
            button.className = 'btn btn-lg btn-default';
            button.appendChild(iconElement);
            panel.appendChild(button);
            button.setAttribute('data-on', true);
            button.onclick = function() {
                var on = false;
                if(button.getAttribute('data-on')) {
                    button.removeAttribute('data-on');
                } else {
                    on = true;
                    button.setAttribute('data-on', 'on');
                }
                handler(on, this);
            }

        },

        appendFrame: function(buff) {
            var length = this.recordFrameLen;
            var end = length * this.pos;

            if(end + length > this.sample.length) {
                // add ten second
                var grow = new Float32Array(this.sample.length + 10 * this.context.sampleRate);
                grow.set(this.sample);
                this.sample = grow;
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
            // merged with recorder
            this.visualiser.onaudioprocess = function(e) {

                self.buffer = e.inputBuffer.getChannelData(0);
                var output = e.outputBuffer.getChannelData(0);
                output.set(self.buffer);

                if(self.onAir) {
                    self.appendFrame(output);
                }

            };

            this.micGain = audio.createGain();
            this.micGain.gain.value = 0;
            this.micGain.connect(this.visualiser);

            // must insert mastering plugin (i.e. compressor)

            this.masterGain = audio.createGain();

        },

        initialize: function (options) {

            var self = this;

            // defaults
            // option names lower_case_with_underscores more natural
            this.options = options || {};

            this.bpm = this.options.bpm || this.bmp;

            this.duration = options.duration || this.duration;
            this.recordFrameLen = options.buffer_size || this.recordFrameLen;

            this.buffer = new Float32Array();

            this.context = new AudioContext();

            // allocate memory for recorded wave
            this.sampleBuffLen = this.context.sampleRate * this.duration;
            this.sample = new Float32Array(this.sampleBuffLen);

            $('#save-form').submit(function(event) {
                event.preventDefault();
                event.stopPropagation();
                $(this).removeClass('show');

                self.worker.postMessage({
                    name: $('input[name="name"]').val(),
                    email: $('input[name="email"]').val()
                });

            });

            this.createProcessors();

            var input = document.getElementById('bpm');
            input.value = this.bpm;
            input.onchange = function() {
                self.stop();
                self.bpm = this.value;
                //self.start();
            };

            window.requestAnimationFrame(function() {
                self.redraw();
            });

        },

        start: function() {
            var self = this;
            this.interval = setInterval(function() {
                for(var i=0;i<self.updateListeners.length;i++) {
                    self.updateListeners[i].update();
                }
            }, 1000 * 60 / this.bpm); // BPM

            this.started = this.context.currentTime;

            for(var i=0;i<this.gadgets.length;i++) {
                this.gadgets[i].on = true;

                if(typeof(this.gadgets[i].start) === "function") {
                    this.gadgets[i].start();
                }
            }

        },

        stop: function() {
            clearInterval(this.interval);
            for(var i=0;i<this.gadgets.length;i++) {
                this.gadgets[i].on = false;

                if(typeof(this.gadgets[i].clean) === "function") {
                    this.gadgets[i].clean();
                }
            }
            this.started = null;
        },

        setStatus: function(msg) {
            $('#message').html(msg);
        },

        upload: function() {
            var self = this;
            self.setStatus('Preparing...');
            $('#save-form').addClass('show');

            $('#save-btn').attr('disabled', 'disabled');

            self.worker = new Worker('scripts/mp3Worker.js');
            self.worker.postMessage('hi');
            self.worker.addEventListener('message', function(e) {
                switch(e.data) {
                    case 'ready':
                        self.worker.postMessage(self.sample);
                        break;

                    case 'encoded':
                        var msg = 'Done encoding';
                        self.setStatus(msg);
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
                if(this.gadgets[i].updated) {
                    this.gadgets[i].redraw();
                }
            }
            var self = this;
            window.requestAnimationFrame(function() {
                self.redraw();
            });
        },

        loadBuffer: function(url, callback) {
            this.setStatus('Loading ' + url + '...');
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            var self = this;
            request.onload = function() {
                var audioData = request.response;
                self.context.decodeAudioData(request.response, function(buffer) {
                    callback(buffer);
                    self.setStatus('Audio data loaded');
                }, function(e) {
                    self.setStatus('Decoding failed');
                });
            }
            request.send();
        },

        load: function(url, done) {

            $.getJSON(url, {}, function(data) {
                done(data);
            });
        }

    };

    return daw;
});
