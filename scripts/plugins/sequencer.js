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

        onMouseDown: function(event) {

            var x = this.getX(event);
            var y = this.height() - this.getY(event);

            var note = Math.floor(y / this.dy);
            var pos = Math.floor(x / this.dx);

            this.pattern[pos][note] = !this.pattern[pos][note] ? 1 : 0;
            this.updated = true;
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

                    for(var j=0;j<this.pattern[4 * beat + i].length;j++) {

                        if(this.pattern[4 * beat + i][j] > 0) {
                            var time = beatStart + i * this.duration / this.len;
                            this.synth[0].playNote(j, time);
                        }
                    }
                }
            }
        },

        redraw: function() {
            this.clear();

            for(var i=0;i<this.pattern.length;i++) {
                for(var j=0;j<this.pattern[i].length;j++) {
                    if(this.pattern[i][j] > 0) {
                        var y = this.height() - this.dy * (j + 1);
                        this.context.fillRect(this.dx * i, y, this.dx, this.dy);
                    }
                }
            }

            var x = ((this.audio.currentTime - this.step) % this.duration) * this.width() / this.duration;

            this.context.fillStyle = '#FF0';
            this.context.fillRect(x, 0, 1, this.height());
        },

        control: function(synth) {
            this.synth.push(synth);
        },

        initialize: function() {
            this._super();

            this.len = this.options.len || this.len;

            for(var i=0;i<this.len;i++) {
                this.pattern[i] = [];
            }

            this.duration = 60 * this.len / 4 / this.rack.bpm;
            this.step = this.duration / (this.len / 4);
            this.dx = this.width() / this.len;
            this.dy = this.height() / 24;

            var self = this;
            this.addButton('glyphicon glyphicon-play', function(on) {
                self.on = on;
                self.updated = on;
            }, {
                type: 'checkbox',
                checked: 'glyphicon glyphicon-pause'
            });
        }
    });

    return Sequencer;
});
