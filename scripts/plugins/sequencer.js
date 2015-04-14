/**
 * Sequencer
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/sequencer', [
    'Gadget',
    'jquery'
    ], function(Gadget, $) {

    var Sequencer = Gadget.extend({

        pattern: null,
        len: 16,
        on: false,
        synth: null,
        duration: 0,
        range: 24,
        dx: 0,
        dy: 0,

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
            for(var i=0;i<data.length;i++) {
                for(var j=0;j<data[i].length;j++) {
                    this.pattern[i][j] = parseInt(data[i][j]);
                }
            }
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

            var pattern = [2, 2, 1, 2, 2, 2, 1]; // major

            var k = -8;
            this.context.globalAlpha = 0.3;
            for(var i=0;i<this.pattern.length;i++) {
                k += pattern[i % pattern.length];
                this.context.fillRect(0, this.height() - this.dy * k, this.width(), this.dy);
            }
            this.context.globalAlpha = 1;

            for(var i=0;i<this.pattern[0].length;i++) {
                this.hline(this.dy * i, 0.3);
            }

            var x = ((this.audio.currentTime - this.step) % this.duration) * this.width() / this.duration;

            for(var i=0;i<this.pattern.length/4;i++) {
                this.vline(this.dx * 4 * i, 0.5);
            }

            for(var i=0;i<this.pattern.length;i++) {
                for(var j=0;j<this.pattern[i].length;j++) {
                    if(this.pattern[i][j] > 0) {
                        var y = this.height() - this.dy * (j + 1);
                        this.context.fillRect(this.dx * i, y, this.dx, this.dy);
                    }
                }
            }

            this.vline(x, 1, '#FF0');
        },

        control: function(synth) {
            this.synth.push(synth);
        },

        play: function() {
            this.on = true;
            this.updated = true;
        },

        initPattern: function() {
            for(var i=0;i<this.len;i++) {
                this.pattern[i] = [];
                for(var j=0;j<this.range;j++) {
                    this.pattern[i][j] = 0;
                }
            }
        },

        initialize: function() {
            this._super();

            this.len = this.options.len || this.len;
            this.range = this.options.range || this.range;

            this.pattern = [];
            this.initPattern();

            this.duration = 60 * this.len / 4 / this.rack.bpm;
            this.step = this.duration / (this.len / 4);
            this.dx = this.width() / this.len;
            this.dy = this.height() / this.range;

            var self = this;

            this.addButton('fa fa-floppy-o', function(on) {
                $.post('api/patterns', {
                    pattern: self.pattern
                }, function(response) {
                    self.rack.setStatus('Pattern saved');
                    self.pattern = response.pattern;
                }, 'json');
            }, {
                type: 'checkbox',
                checked: 'fa fa-floppy-o'
            });
            this.addButton('fa fa-file-o', function(on) {
                self.initPattern();
            });
            this.addButton('fa fa-coffee', function(on) {
                self.rack.load('api/patterns/3', function(data) {
                    self.loadPattern(data);
                })
            });
        }
    });

    return Sequencer;
});
