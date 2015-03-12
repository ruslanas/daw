/**
 * Synthesizer
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

const FULL_CIRCLE = Math.PI * 2;

define('plugins/synth', [
    'Gadget',
    'jquery',
    'bezier'
    ], function(Gadget, $) {

    var Synth = Gadget.extend({

        notes: [],
        note: null,
        on: false,
        started: null,
        status: '',

        init: function() {
            this._super();
            var f = 55;
            for(var i=0;i<12;i++) {
                this.notes.push(f);
                f = f * Math.pow(2, 1/12);
            }
            this.bezierPoints = {
                p0: Bezier.point(0, 0),
                p1: Bezier.point(1, 0),
                c0: Bezier.point(0, 2),
                c1: Bezier.point(0, 0)
            };
        },

        redraw: function() {

            this.clear();

            // draw envelope shape
            var points = this.bezierPoints;
            var scaleX = this.canvas.width;
            var scaleY = this.canvas.height;

            this.context.beginPath();
            this.context.moveTo(points.p0.x * scaleX, points.p0.y * scaleY);
            this.context.bezierCurveTo(
                points.c0.x * scaleX, points.c0.y * scaleY,
                points.c1.x * scaleX, points.c1.y * scaleY,
                this.canvas.width, 0);

            this.context.stroke();

            if(this.on) {
                this.context.beginPath();
                this.context.arc(this.x, this.y, 10, 0, FULL_CIRCLE);
                this.context.fill();
            }

            this.context.fillText(this.status, 0, this.canvas.height);
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
            this.y = event.clientY - $canvas.offset().top + $('body').scrollTop();
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

                var len = cycle * 30;

                var sample = this.rack.context.createBuffer(
                    1, len, this.getSampleRate());

                var buff = sample.getChannelData(0);

                // fill samples
                for(var j=0;j<len;j++) {

                    buff[j] = Math.sin(2 * Math.PI * j / cycle)
                     + Math.sin( 4 * Math.PI * j / cycle) * 1.5
                     + Math.sin(8 * Math.PI * j / cycle) * 0.8
                     + Math.sin(32 * Math.PI * j / cycle) * 0.8
                     ;

                }
                this.applyEnvelope(buff);
                this.samples.push(sample);
            }
            this.status = 'Ready';
        },

        applyEnvelope: function(buff) {
            this.status = 'Applying envelope';

            var points = this.bezierPoints;

            var envelope = new Bezier(points.p0, points.p1, points.c0, points.c1);

            var t = [];
            for(var i=0;i<buff.length;i++) {
                var coords = envelope.getCoordinates(i / buff.length);
                if(coords.x >= 0 && coords.x <= 1) {
                    t[Math.floor(coords.x * buff.length)] = coords.y;
                }
            }

            // fill missing values
            t[0] = 0;
            for(var i=0;i<buff.length;i++) {
                if(t[i] === undefined) {
                    t[i] = t[i-1]; // fill missing values
                }
                buff[i] *= t[i];
            }
        },

        initialize: function() {
            this._super();

            var gain = this.rack.context.createGain();
            gain.gain.value = 0.1; // start from min
            gain.connect(this.rack.recorder);
            this.gain = gain;

            this.generate();
        }
    });

    return new Synth();
});