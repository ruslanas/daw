/**
 * Synthesizer
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

const FULL_CIRCLE = Math.PI * 2;

define('plugins/synth', [
    'Gadget',
    'bezier'
    ], function(Gadget) {

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
        bezierPoints: null,
        down: false,
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

            this.context.fillText(this.status, 2, this.canvas.height - 2);

            this.context.fillStyle = '#FF0';
            this.context.fillRect(
                points.c0.x * scaleX - 2, points.c0.y * scaleY - 2, 4, 4);
            this.context.fillRect(
                points.c1.x * scaleX - 2, points.c1.y * scaleY - 2, 4, 4);
        },

        onReady: function(done) {
            done();
        },

        onMouseDown: function(event) {
            var x = this.getX(event);
            var y = this.getY(event);

            var dx0 = x - this.bezierPoints.c0.x * this.canvas.width;
            var dy0 = y - (1 - this.bezierPoints.c0.y) * this.canvas.height;
            var dx1 = x - this.bezierPoints.c1.x * this.canvas.width;
            var dy1 = y - (1 - this.bezierPoints.c1.y) * this.canvas.height;

            if(dx0 * dx0 + dy0 * dy0 < dx1 * dx1 + dy1 * dy1) {
                this.down = this.bezierPoints.c0;
            } else {
                this.down = this.bezierPoints.c1;
            }

        },

        onMouseMove: function(event) {
            if(!this.down) {
                return;
            }
            this.x = this.getX(event);
            this.y = this.getY(event);

            this.down.x = this.x / this.canvas.width;
            this.down.y = 1 - this.y / this.canvas.height;

        },

        onMouseUp: function(event) {
            this.down = false;
            this.x = this.getX(event);
            this.y = this.getY(event);

            this.down.x = this.x / this.canvas.width;
            this.down.y = 1 - this.y / this.canvas.height;

            this.generate();
        },

        playNote: function(note) {

            var self = this;

            this.status = ['~', Math.round(this.notes[note]), 'Hz'].join('');

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