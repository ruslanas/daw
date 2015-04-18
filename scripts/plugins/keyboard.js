/**
 * Keyboard plugin
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/keyboard', [
    'Gadget',
    ], function(Gadget) {

    var Keyboard = Gadget.extend({

        key: false,
        row1: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 21, 22],
        row2: [
            -1, 0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6, 6,
            7, 7, 7, 8, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13,
            14, 14, 14, 15, 15, 15, 16, 16, 17, 17, 18, 18,
            19, 19, 19, 20, 20, 20, 21, 21, 22, 22, 23
        ],
        synth: null,

        init: function() {
            this._super();
            this.title = 'Keyboard';
            this.down = false;
            this.synth = [];
        },

        getNote: function(event) {
            var x = this.getX(event);
            var y = this.height() - this.getY(event);

            if(y < this.baseline) {
                var k = Math.floor(x / this.canvas.width * 14);
                var note = this.row1[k];
            } else {
                var k = Math.floor((x / this.canvas.width * 56));
                var note = this.row2[k];
            }
            return note;
        },

        onMouseMove: function(event) {
            var note = this.getNote(event);
            if(this.down !== false && this.down !== note) {
                this.play(note);
                this.down = note;
            }
        },

        control: function(synth) {
            this.synth.push(synth);
        },

        play: function(note) {
            this.synth[0].playNote(note);
        },

        onMouseUp: function(event) {
            this.down = false;
        },

        onMouseDown: function(event) {
            var note = this.getNote(event);
            this.down = note;
            this.play(note);
        },

        redraw: function() {

            var kw = this.canvas.width / 14;

            for(var i=0;i<24;i++) {
                this.context.fillRect(i*kw + kw, 0, 1, this.canvas.height);
            }

            // black
            for(var i=0;i<24;i++) {
                if(i===2 || i===5 || i===9 || i === 12) {
                    continue;
                }
                this.context.fillRect(i * kw - kw / 4, 0, kw / 2, this.canvas.height / 2);
            }
            this.updated = false;
        },

        initialize: function() {
            this._super();

            var self = this;
            document.onkeydown = function(event) {
                var keyMap = {
                    65: 4,  // a
                    83: 6,  // s
                    68: 8,  // d
                    70: 9,  // f
                    71: 11, // g
                    72: 13, // h
                    74: 15, // j
                    75: 16  // k
                };
                if(keyMap[event.which] !== undefined) {
                    self.play(keyMap[event.which]);
                }
            }
        }
    });

    return Keyboard;
});
