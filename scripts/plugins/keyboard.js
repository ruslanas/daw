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

        row1: null,
        row2: null,
        major: [2, 2, 1, 2, 2, 2, 1],                // major key pattern
        black: [3, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 3], // black key pattern
        pitches: "CDEFGAB",                          // pitch names
        synth: null,
        keyMap: null,
        notesOn: null,
        help: "You can use computer keyboard Z, X, C, V, etc. and Q, W, E, R,"
              + " etc. one octave higher",

        octaves: 2,

        init: function() {

            this._super();

            this.title = 'Keyboard';
            this.height(60);
            this.down = false;
        },

        fillRows: function() {
            this.row1 = [];
            var semitone = 0;
            for(var i=0;i<7 * this.octaves;i++) {
                this.row1.push(semitone + 3);
                semitone += this.major[i % this.major.length];
            }

            this.row2 = [];
            for(var i=0;i<this.black.length * this.octaves;i++) {
                for(var j=0;j<this.black[i % this.black.length];j++) {
                    this.row2.push(i + 3);
                }
            }
        },

        getNote: function(event) {
            var x = this.getX(event);
            var y = this.height() - this.getY(event);

            if(y < this.baseline) {
                var k = Math.floor(x / this.canvas.width * this.row1.length);
                var note = this.row1[k];
            } else {
                var k = Math.floor((x / this.canvas.width * this.row2.length));
                var note = this.row2[k];
            }
            return note;
        },

        onMouseMove: function(event) {
            var note = this.getNote(event);
            if(this.down !== false && this.down !== note) {
                this.stop(this.down);
                this.play(note);
            }
        },

        control: function(synth) {
            this.synth = synth;
        },

        play: function(note) {
            this.down = note;
            this.notesOn[note] = true;
            this.synth.playNote(note);
            this.updated = true;
        },

        stop: function(note) {
            this.notesOn[note] = false;
            this.synth.stop(note);
            this.down = false;
            this.updated = true;
        },

        onMouseUp: function(event) {
            var note = this.getNote(event);
            this.stop(note);
        },

        onMouseDown: function(event) {
            var note = this.getNote(event);
            this.play(note);
        },

        redraw: function() {

            this.clear();

            this.context.textAlign = 'center';
            var numKeys = 7 * this.octaves;
            var kw = this.canvas.width / numKeys;

            var b = 0; // count black keys

            var dx = 3 * kw / 4;
            for(var i=0;i<numKeys;i++) {

                if(this.notesOn[i + b + 3] === true) {

                    this.context.fillStyle = '#FF0';
                    this.context.fillRect(i * kw, 0, kw, this.canvas.height);
                    this.context.fillStyle = this.color;
                }

                this.context.fillRect(i*kw + kw, 0, 1, this.canvas.height);

                // black
                if(this.major[i % this.major.length] === 2) {
                    b++;
                }

                this.context.fillText(this.pitches[i % this.pitches.length], i * kw + kw/2, this.height() - 2);


            }

            b = 0;

            for(var i=0;i<numKeys;i++) {
                if(this.major[i % this.major.length] === 2) {
                    if(this.notesOn[i + b + 4]) {
                        this.context.fillStyle = '#F00';
                    } else {
                        this.context.fillStyle = this.color;
                    }
                    this.context.fillRect(i * kw + dx, 0, kw / 2, this.canvas.height / 2);
                    b++;
                }
            }

            this.updated = false;
        },

        initialize: function() {
            this._super();

            var self = this;
            var keys = "zsxdcvgbhnjmq2w3er5t6y7ui9O0P".toUpperCase();

            this.fillRows();
            this.keyMap = [];

            for(var i=0;i<keys.length;i++) {
                this.keyMap[keys[i].charCodeAt(0)] = i + 3;
            }

            this.notesOn = [];
            document.onkeydown = function(event) {
                if(self.keyMap[event.which] !== undefined) {
                    self.play(self.keyMap[event.which]);
                }
            }
            document.onkeyup = function(event) {
                if(self.keyMap[event.which] !== undefined) {
                    self.stop(self.keyMap[event.which]);
                }
            }
        }
    });

    return Keyboard;
});
