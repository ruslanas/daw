/**
 * Sequencer
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/sequencer', [
    'plugins/keyboard',
    'jquery'
    ], function(Keyboard, $) {

    var Sequencer = Keyboard.extend({

        pattern: null,
        len: 16,
        on: false,
        duration: 0,
        range: 24,
        dx: 0,
        dy: 0,
        needsFullRedraw: true,
        prevX: -1,
        help: "On the step sequencers, musical notes are rounded into the steps"
              + " of equal time-interval. White stripes represent major keys."
              + " CTRL + click for major chord.",

        init: function() {
            this._super();
            this.pattern = [];
            this.title = 'Sequencer';
        },

        onMouseDown: function(event) {

            var x = this.getX(event);
            var y = this.height() - this.getY(event);

            var note = Math.floor(y / this.dy);
            var pos = Math.floor(x / this.dx);

            this.pattern[pos][note] = !this.pattern[pos][note] ? 1 : 0;

            if(event.ctrlKey) {
                var majorThird = note + 4;
                var perfectFith = note + 7;
                this.pattern[pos][majorThird] = 1;
                this.pattern[pos][perfectFith] = 1;
            }

            this.updated = true;
        },

        loadPattern: function(data) {
            for(var i=0;i<this.pattern.length;i++) {
                if(!data[i]) {
                    continue;
                }
                for(var j=0;j<this.pattern[i].length;j++) {
                    if(!data[i][j]) {
                        continue;
                    }
                    this.pattern[i][j] = parseInt(data[i][j]);
                }
            }
            this.needsFullRedraw = true;
        },

        update: function() {
            if(this.on) {
                this.updateStep();
                var offset = this.audio.currentTime % this.duration;
                var beat = Math.floor((this.len / 4) * offset / this.duration);

                var beatStart = this.audio.currentTime - offset + (beat + 1) * this.step;

                for(var i=0;i<4;i++) {
                    var curr = 4 * beat + i;
                    for(var j=0;j<this.pattern[curr].length;j++) {

                        if(this.pattern[curr][j] > 0) {
                            var time = beatStart + i * this.duration / this.len;
                            this.synth.playNote(j, time);
                        }
                    }
                }
            }
        },

        redrawFull: function() {
            this.clear();

            var pattern = [2, 2, 1, 2, 2, 2, 1]; // major

            var k = -8;
            this.context.fillStyle = '#FFF';
            for(var i=0;i<this.pattern.length;i++) {
                k += pattern[i % pattern.length];
                this.context.fillRect(0, this.height() - this.dy * k, this.width(), this.dy);
            }

            this.context.fillStyle = '#CCC';
            for(var i=1;i<this.pattern[0].length;i++) {
                this.hline(this.dy * i, 0.5);
            }

            for(var i=1;i<this.pattern.length/4;i++) {
                this.vline(this.dx * 4 * i, 0.5);
            }

        },

        clearLayer: function() {
            this.layerContext.clearRect(0, 0, this.width(), this.height());
        },

        redraw: function() {

            if(this.needsFullRedraw) {
                this.redrawFull();
                this.needsFullRedraw = false;
            }

            this.clearLayer();

            var x = ((this.audio.currentTime - this.step) % this.duration) * this.width() / this.duration;
            this.vline(x, 1, '#00F', this.layerContext);
            for(var i=0;i<this.pattern.length;i++) {
                for(var j=0;j<this.pattern[i].length;j++) {
                    if(this.pattern[i][j] > 0) {
                        var noteX = this.dx * i;
                        if(x > noteX && x < noteX + this.dy * 1.5) {
                            this.layerContext.fillStyle = '#CCC';
                        } else {
                            this.layerContext.fillStyle = '#000';
                        }

                        var y = this.height() - this.dy * (j + 1);
                        this.layerContext.fillRect(noteX, y, this.dx, this.dy);
                    }
                }
            }


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
            this.needsFullRedraw = true;
        },

        updateStep: function() {
            // 15 = 60 / 4
            this.duration = 15 * this.len / this.rack.bpm;
            this.step = this.duration / (this.len / 4);
        },

        initialize: function() {
            this._super();

            this.len = this.options.len || this.len;
            this.range = this.options.range || this.range;

            this.pattern = [];
            this.initPattern();

            this.dx = this.width() / this.len;
            this.dy = this.height() / this.range;

            var self = this;

            this.addLayer();

            this.addButton('fa fa-floppy-o', function(on) {
                $.post('api/patterns', {
                    pattern: self.pattern,
                    range: self.range,
                    length: self.len
                }, function(response) {
                    self.rack.setStatus('Pattern saved');
                    self.pattern = response.pattern;
                }, 'json');
            }, {
                type: 'checkbox',
                checked: 'fa fa-floppy-o',
                tooltip: "Save pattern"
            });

            this.addButton('fa fa-file-o', function(on) {
                self.initPattern();
            }, {
                tooltip: "Clear pattern"
            });

            this.addButton('fa fa-coffee', function(on) {
                self.rack.load('api/pattern/random/' + self.len, function(data) {
                    self.loadPattern(data);
                });
            }, {
                type: 'checkbox',
                checked: 'fa fa-coffee',
                tooltip: "Load random pattern"
            });
        }
    });

    return Sequencer;
});
