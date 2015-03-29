/**
 * Sequencer
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/sequencer', ['Gadget'], function(Gadget) {

    var Sequencer = Gadget.extend({

        pattern: null,
        len: 16,
        on: false,
        synth: null,
        duration: 0,

        init: function() {
            this._super();
            this.pattern = [];
            this.synth = [];
            this.title = 'Sequencer';
        },

        onClick: function(event) {

            var dx = this.canvas.width / this.len;
            var dy = this.canvas.height / 24;

            var x = this.getX(event);
            var y = this.height() - this.getY(event);

            var note = Math.floor(y/dy);
            var pos = Math.floor(x/dx);

            this.pattern[pos] = (this.pattern[pos] !== note) ? note : -1;

        },

        loadPattern: function(data) {
            this.pattern = data;
        },

        update: function() {
            if(this.on) {

                var offset = this.audio.currentTime % this.duration;
                var beat = Math.floor(this.len / 4 * offset / this.duration);

                var beatStart = this.audio.currentTime - offset + (beat + 1) * this.step;

                for(var i=0;i<4;i++) {

                    var note = this.pattern[4 * beat + i];
                    var time = beatStart + i * this.duration / this.len;

                    if(note >= 0) {
                        this.synth[0].playNote(note, time);
                    }
                }
            }
        },

        redraw: function() {
            this.clear();

            for(var i=0;i<this.pattern.length;i++) {
                this.context.fillRect(this.dx * i, this.height() - this.dy * (this.pattern[i] + 1), this.dx, this.dy);
            }

            var x = ((this.audio.currentTime - this.step) % this.duration) * this.width() / this.duration;

            this.context.fillRect(x, 0, 0.5, this.height());

        },

        control: function(synth) {
            this.synth.push(synth);
        },

        initialize: function() {
            this._super();

            this.len = this.options.len || this.len;

            for(var i=0;i<this.len;i++) {
                this.pattern[i] = -1;
            }

            this.duration = 60 * this.len / 4 / this.rack.bpm;
            this.step = this.duration / (this.len / 4);
            this.dx = this.width() / this.len;
            this.dy = this.height() / 24;

            var self = this;
            this.addButton('glyphicon glyphicon-play', function(on) {
                self.on = on;
            }, {
                type: 'checkbox',
                checked: 'glyphicon glyphicon-pause'
            });
        }
    });

    return Sequencer;
});
