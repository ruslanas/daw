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
        status: '',
        bend: 0.01,
        baseFreq: 55,
        sequencer: null,
        x: -1,
        y: -1,

        init: function() {
            this._super();
            var f = this.baseFreq;

            for(var i=0;i<24;i++) {
                this.notes.push(f);
                f = f * Math.pow(2, 1/12);
            }

            this.bezierPoints = {
                p0: Bezier.point(0, 0),
                p1: Bezier.point(1, 0),
                c0: Bezier.point(0, 2.2),
                c1: Bezier.point(0.1, 0)
            };
        },

        update: function() {
            if(this.sequencer && this.sequencer.on) {
                var note = this.sequencer.next();
                if(note >= 0) {
                    this.playNote(note);
                }
            }
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

            var $canvas = $(this.canvas);
            this.x = event.clientX - $canvas.offset().left;
            this.y = event.clientY - $canvas.offset().top + $('body').scrollTop();
            this.note = Math.floor(this.x / ($canvas.width() / 12));

            if(this.y > (this.canvas.height / 2) ) {
                this.note += 12;
            }
            this.on = true;
            this.playNote(this.note);

        },

        playNote: function(note) {

            var self = this;

            this.status = ['~', Math.round(this.notes[note]), 'Hz'].join();

            var oscillator = this.rack.context.createBufferSource();

            oscillator.buffer = this.samples[note];

            oscillator.connect(this.gain);

            oscillator.onended = function() {
                self.on = false;
                oscillator.stop();
                oscillator.disconnect(self.gain);
                oscillator = null;
            };

            oscillator.start();

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

                var bend = Math.random() / 10;

                // fill samples
                for(var j=0;j<len;j++) {
                    buff[j] = Math.sin((2 * Math.PI * j) / cycle)
                        + Math.sin( 4 * Math.PI * (j + bend) / cycle) * 0.3
                        + Math.sin( 8 * Math.PI * (j) / cycle) * 0.2
                        ;
                    bend += -this.bend;
                }
                this.applyEnvelope(buff);
                this.samples.push(sample);
            }
            this.status = 'Ready';
        },

        applyEnvelope: function(buff) {
            this.status = 'Applying envelope';

            var points = this.bezierPoints;

            var envelope = new Bezier(
                    points.p0, points.p1, points.c0, points.c1);

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

            if(this.options.sequencer) {
                this.sequencer = this.options.sequencer;
            }

            var gain = this.rack.context.createGain();
            gain.gain.value = 0.25; // start from min
            gain.connect(this.rack.recorder);
            this.gain = gain;

            this.generate();
        }
    });

    return new Synth();
});