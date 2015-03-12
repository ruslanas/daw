/**
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

const FULL_CIRCLE = Math.PI * 2;

define('plugins/synth', ['Gadget', 'jquery'], function(Gadget, $) {

    var Synth = Gadget.extend({

        notes: [],
        note: null,
        on: false,
        started: null,
        status: '',

        init: function() {
            this._super();
            var f = 440;
            for(var i=0;i<12;i++) {
                this.notes.push(f);
                f = f * Math.pow(2, 1/12);
            }
        },

        redraw: function() {

            this.clear();

            if(this.on) {
                this.context.beginPath();
                this.context.arc(this.x, this.y, 10, 0, FULL_CIRCLE);
                this.context.fill();
            }

            this.context.fillText(this.status, 0, this.canvas.height);
        },

        update: function() {
            /*
            if(this.on && this.started && (Date.now() - this.started) > 100) {
                this.oscillator.stop();
                this.oscillator.disconnect(this.gain);
                this.on = false;
                this.started = null;
            }
            */
        },

        onMouseDown: function(event) {
            var self = this;
            // only one note can be played at a time
            if(this.on) {
                return;
            }
            this.on = true;
            this.started = Date.now();

            var $canvas = $(this.canvas);
            this.x = event.clientX - $canvas.offset().left;
            this.y = event.clientY - $canvas.offset().top;
            this.note = Math.floor(this.x / ($canvas.width() / 12));

            var oscillator = this.rack.context.createBufferSource();

            this.status = '~' + Math.round(this.notes[this.note]) + 'Hz';

            oscillator.buffer = this.samples[this.note];

            this.oscillator = oscillator;

            oscillator.onended = function() {
                oscillator.stop();
                oscillator.disconnect(self.gain);
                self.on = false;

            };

            this.oscillator.connect(this.gain);

            var delay = this.rack.context.createDelay();
            delay.delayTime.value = .3;

            var feedback = this.rack.context.createGain();
            feedback.gain.value = 0.4;

            feedback.connect(delay);
            delay.connect(feedback);

            this.oscillator.connect(delay);
            delay.connect(this.gain);
            this.oscillator.start();

        },

        // generate sample and apply envelope
        generate: function() {
            this.status = 'Generating waves...';
            this.samples = [];
            for(var i=0;i<this.notes.length;i++) {

                var freq = this.notes[i];
                var cycle = this.getSampleRate() / freq;

                var len = cycle * 50;

                var sample = this.rack.context.createBuffer(
                    1, len, this.getSampleRate());

                var buff = sample.getChannelData(0);

                // fill samples
                for(var j=0;j<len;j++) {

                    buff[j] = Math.sin(2 * Math.PI * j / cycle);

                }
                this.applyEnvelope(buff);
                this.samples.push(sample);
            }
            this.status = 'Ready';
        },

        // fade in and fade out
        applyEnvelope: function(buff) {
            this.status = 'Applying envelope';
            for(var i=0;i<1000;i++) {
                buff[i] *= i/1000;
                buff[buff.length - 1 - i] *= i/1000;
            }
        },

        initialize: function() {
            this._super();

            var gain = this.rack.context.createGain();
            gain.gain.value = 0.2; // start from min
            gain.connect(this.rack.recorder);
            this.gain = gain;

            this.generate();
        }
    });

    return new Synth();
});