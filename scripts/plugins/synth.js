/**
 * Synthesizer
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

var FULL_CIRCLE = Math.PI * 2;

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
        envelope: null,
        down: false,
        x: -1,
        y: -1,
        help: "Drag control points (square) to change sound envelope.",

        init: function() {
            this._super();

            this.title = 'Synthesizer';
            this.notes = [];
            this.samples = [];

            this.envelope = {
                p0: Bezier.point(0, 1),
                p1: Bezier.point(1, 0),
                c0: Bezier.point(0, 0),
                c1: Bezier.point(0.5, 0)
            };
        },

        redraw: function() {

            this.clear();

            // draw envelope shape
            var points = this.envelope;
            var scaleX = this.canvas.width;
            var scaleY = this.canvas.height;

            var x1 = points.p0.x * scaleX;
            var y1 = points.p0.y * scaleY;
            var cx1 = points.c0.x * scaleX;
            var cy1 = points.c0.y * scaleY;
            var x2 = points.p1.x * scaleX;
            var y2 = points.p1.y * scaleY;
            var cx2 = points.c1.x * scaleX;
            var cy2 = points.c1.y * scaleY;

            this.context.strokeStyle = this.color;
            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.bezierCurveTo(cx1, cy1, cx2, cy2, this.canvas.width, 0);
            this.context.stroke();

            this.context.strokeStyle = '#F00';
            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.lineTo(cx1, cy1);
            this.context.stroke();

            this.context.beginPath();
            this.context.moveTo(x2, y2);
            this.context.lineTo(cx2, cy2);
            this.context.stroke();

            this.context.fillRect(cx1 - 2, cy1 - 2, 4, 4);
            this.context.fillText(
                '(' + points.c0.x.toFixed(3) + ';' + points.c0.y.toFixed(3) + ')', cx1 + 6, cy1);
            this.context.fillRect(cx2 - 2, cy2 - 2, 4, 4);
            this.context.fillText(
                '(' + points.c1.x.toFixed(3) + ';' + points.c1.y.toFixed(3) + ')', cx2 + 6, cy2);

            this.updated = false;
        },

        onReady: function(done) {
            done();
        },

        onChange: function(event) {
            this.x = this.getX(event);
            this.y = this.height() - this.getY(event);

            if(this.down) {
                this.down.x = this.x / this.width();
                this.down.y = 1 - this.y / this.height();
            }
            this.updated = true;
        },

        onMouseDown: function(event) {
            var x = this.getX(event);
            var y = this.height() - this.getY(event);

            var dx0 = x - this.envelope.c0.x * this.width();
            var dy0 = y - (1 - this.envelope.c0.y) * this.height();
            var dx1 = x - this.envelope.c1.x * this.width();
            var dy1 = y - (1 - this.envelope.c1.y) * this.height();

            if(dx0 * dx0 + dy0 * dy0 < dx1 * dx1 + dy1 * dy1) {
                this.down = this.envelope.c0;
            } else {
                this.down = this.envelope.c1;
            }

            this.onChange(event);
        },

        onMouseMove: function(event) {
            if(!this.down) {
                return;
            }

            this.onChange(event);
        },

        onMouseUp: function(event) {
            this.down = false;

            this.onChange(event);
            this.generate();
        },

        playNote: function(note, time, velocity) {
            velocity = velocity || 1;
            if(this.samples[note] === undefined) {
                return;
            }

            time = time || 0;

            var self = this;

            var gain = this.audio.createGain();

            gain.gain.value = velocity;

            gain.connect(this.out);

            var buffSrc = this.audio.createBufferSource();

            buffSrc.buffer = this.samples[note];
            buffSrc.connect(gain);

            buffSrc.onended = function() {
                gain.disconnect(self.out);
                buffSrc.disconnect(gain);
                gain = null;
                buffSrc.onended = null;
                buffSrc = null;
            }

            buffSrc.start(time);

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
                    bezier: this.envelope
                });

            }
        },

        // gadget inserted and attached
        initialize: function() {
            this._super();

            var f = this.options.base_frequency || this.baseFreq;

            this.modes = this.options.modes || [];
            this.len = this.options.len || this.len;
            this.noise = this.options.noise || this.noise;
            this.envelope = this.options.envelope || this.envelope;

            for(var i=0;i<24;i++) {
                this.notes.push(f);
                f = f * Math.pow(2, 1 / 12);
            }

            var amp = this.audio.createGain();
            amp.gain.value = this.gain;

            this.out = amp;

            this.worker = new Worker('scripts/synthWorker.js');
            var self = this;
            this.worker.onmessage = function(msg) {
                var sample = self.audio.createBuffer(
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