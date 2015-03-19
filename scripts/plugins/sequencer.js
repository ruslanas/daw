/**
 * Sequencer
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/sequencer', ['Gadget'], function(Gadget) {

    var Sequencer = Gadget.extend({

        pattern: null,
        idx: 0,
        len: 16,
        on: false,
        synth: null,

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
            var y = this.getY(event);

            var note = Math.floor(y/dy);
            var pos = Math.floor(x/dx);

            this.pattern[pos] = (this.pattern[pos] !== note) ? note : -1;

        },

        loadPattern: function(data) {
            this.pattern = data;
        },

        update: function() {
            var note = this.next();
            if(this.on && note >= 0) {
                for(var i=0;i<this.synth.length;i++) {
                    this.synth[i].playNote(note);
                }
            }
        },

        redraw: function() {
            this.clear();
            var dx = this.canvas.width / this.len;
            var dy = this.canvas.height / 24;

            for(var i=0;i<this.pattern.length;i++) {
                this.context.fillRect(dx * i, this.canvas.height - dy * (this.pattern[i] + 1), dx, dy);
            }
            this.context.fillRect((this.idx % this.pattern.length) * dx, 0, 0.5, this.canvas.height);
        },

        control: function(synth) {
            this.synth.push(synth);
        },

        next: function() {
            this.idx++
            var note = this.pattern[this.idx % this.pattern.length];
            return note;
        },

        initialize: function() {
            this._super();

            for(var i=0;i<this.len;i++) {
                this.pattern[i] = -1;
            }

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
