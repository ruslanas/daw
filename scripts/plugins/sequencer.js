/**
 * Sequencer
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

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
            var dy = (this.canvas.height - this.titleHeight) / 24;

            var x = event.clientX - $(this.canvas).offset().left;
            var y = this.canvas.height - (event.clientY - $(this.canvas).offset().top + $('body').scrollTop());

            if(y > this.canvas.height - this.titleHeight && x > this.canvas.width - 12) {
                this.on = !this.on;
                return;
            }

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
            var dy = (this.canvas.height - this.titleHeight) / 24;

            this.context.clearRect(this.canvas.width - 12, 0, this.canvas.width, 12);
            if(this.on) {
                this.context.fillRect(this.canvas.width - 10, 2, 8, 8);
            } else {
                this.context.strokeRect(this.canvas.width - 10, 2, 8, 8);
            }
            for(var i=0;i<this.pattern.length;i++) {
                this.context.fillRect(dx * i, this.canvas.height - dy * (this.pattern[i] + 1), dx, dy);
            }
            this.context.fillRect((this.idx % this.pattern.length) * dx, this.titleHeight, 0.5, this.canvas.height);
        },

        next: function() {
            this.idx++
            var note = this.pattern[this.idx % this.pattern.length];
            return note;
        },

        initialize: function() {
            this._super();
            this.context.font = '9px Arial';
        }
    });

    return Sequencer;
});
