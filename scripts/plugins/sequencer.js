/**
 * Sequencer
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/sequencer', [
    'Gadget',
    'jquery'
    ], function(Gadget) {

    var Sequencer = Gadget.extend({

        pattern: null,
        idx: 0,
        on: false,
        synth: null,

        init: function() {
            this._super();
            this.pattern = [];
            for(var i=0;i<16;i++) {
                this.pattern[i] = -1;
            }
            this.title = 'Sequencer';
        },

        onClick: function(event) {

            var dx = this.canvas.width / 16;
            var dy = this.canvas.height / 24;

            var x = event.clientX - $(this.canvas).offset().left;
            var y = this.canvas.height - (event.clientY - $(this.canvas).offset().top + $('body').scrollTop());

            var note = Math.floor(y/dy);
            var pos = Math.floor(x/dx);

            this.pattern[pos] = (this.pattern[pos] !== note) ? note : -1;

        },

        loadPattern: function(data) {
            this.pattern = data;
        },

        update: function() {
            var note = this.next();
            if(this.on) {
                if(note >= 0) {
                    this.synth.playNote(note);
                }
            }
        },

        redraw: function() {
            this.clear();
            var dx = this.canvas.width / 16;
            var dy = this.canvas.height / 24;

            for(var i=0;i<this.pattern.length;i++) {
                this.context.fillRect(dx * i, this.canvas.height - dy * (this.pattern[i] + 1), dx, dy);
            }
            this.context.fillRect((this.idx % this.pattern.length) * dx, 0, 0.5, this.canvas.height);
        },

        next: function() {
            this.idx++
            var note = this.pattern[this.idx % this.pattern.length];
            return note;
        },

        initialize: function() {
            this._super();

            var self = this;
            this.context.font = '9px Arial';
            this.addButton('glyphicon glyphicon-play', function(on) {
                self.on = on;
            });
        }
    });

    return Sequencer;
});
