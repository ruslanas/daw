/**
 * Keyboard plugin
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/keyboard', [
    'plugins/sequencer',
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

        init: function() {
            this._super();
            this.title = 'Keyboard';
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

        onClick: function(event) {
            // void
        },

        onMouseMove: function(event) {
            var note = this.getNote(event);
            if(this.key !== false && this.key !== note) {
                this.play(note);
            }
        },

        play: function(note) {
            this.synth[0].playNote(note);
        },

        onMouseUp: function(event) {
            this.key = false;
        },

        onMouseDown: function(event) {
            var note = this.getNote(event);
            this.key = note;
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
            // setup
        }
    });

    return Keyboard;
});
