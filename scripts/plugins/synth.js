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
        bend: 0.5,
        baseFreq: 110,
        len: 20000,
        sequencer: null,
        samples: [],
        modes: [],
        noise: 0,
        gain: 1,
        out: null,
        x: -1,
        y: -1,

        init: function() {
            this._super();

            this.notes = [];
            this.samples = [];

            this.bezierPoints = {
                p0: Bezier.point(0, 1),
                p1: Bezier.point(1, 0),
                c0: Bezier.point(0, 0),
                c1: Bezier.point(0.5, 0)
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

        onReady: function(done) {
            done();
        },

        onMouseUp: function(event) {

            $canvas = $(this.canvas);
            this.x = event.clientX - $canvas.offset().left;
            this.y = event.clientY - $canvas.offset().top + $('body').scrollTop();

            this.bezierPoints.c0 = {
                x: this.x / this.canvas.width,
                y: 2 * this.y / this.canvas.height
            };

            this.generate();
        },

        playNote: function(note) {

            var self = this;

            this.status = ['~', Math.round(this.notes[note]), 'Hz'].join();

            var oscillator = this.rack.context.createBufferSource();

            oscillator.buffer = this.samples[note];

            oscillator.connect(this.out);

            oscillator.onended = function() {
                self.on = false;
                oscillator.stop();
                oscillator.disconnect(self.out);
                oscillator = null;
            };

            oscillator.start();

        },

        // generate sample and apply envelope
        generate: function() {
            var self = this;

            for(var i=0;i<this.notes.length;i++) {

                this.worker.postMessage({
                    idx: i,
                    noise: this.noise,
                    modes: this.modes,
                    freq: this.notes[i],
                    sampleRate: this.getSampleRate(),
                    len: self.len,
                    bezier: this.bezierPoints
                });

            }
        },

        // gadget inserted and attached
        initialize: function() {
            this._super();

            var f = this.baseFreq;
            for(var i=0;i<24;i++) {
                this.notes.push(f);
                f = f * Math.pow(2, 1 / 12);
            }

            var amp = this.rack.context.createGain();
            amp.gain.value = this.gain;

            this.out = amp;

            this.worker = new Worker('scripts/synthWorker.js');
            var self = this;
            this.worker.onmessage = function(msg) {
                var sample = self.rack.context.createBuffer(
                    1, msg.data.len, self.getSampleRate());

                var buff = sample.getChannelData(0);
                buff.set(msg.data.buff);
                self.samples[msg.data.idx] = sample;
                if(msg.data.idx === self.notes.length) {
                    self.onReady();
                }
            };

            this.generate();
        }
    });

    return Synth;
});