/**
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

define('plugins/synth', ['Gadget', 'jquery'], function(Gadget, $) {

    var Synth = Gadget.extend({

        notes: [],

        init: function() {
            this._super();
            this.title = 'Synth';
            var f = 440;
            for(var i=0;i<12;i++) {
                this.notes.push(f);
                f = f * Math.pow(2, 1/12);
            }
        },
        over: 0,
        redraw: function() {

            this.clear();
            var w = this.canvas.width / 12;
            this.context.fillRect((this.over + 1) * w, 14, w, this.canvas.height - 14);
        },

        onMouseMove: function(event) {
            var $canvas = $(this.canvas);
            var n = Math.floor((event.clientX - $canvas.offset().left - $canvas.position().left) / ($canvas.width() / 12));
            this.oscillators[0].oscillator.frequency.value = this.notes[n];
            this.oscillators[1].oscillator.frequency.value = event.clientY;
            this.over = n;
        },

        onClick: function(event) {
            console.log(event);
        },

        initialize: function() {
            this._super();
            // setup

            var self = this;

            this.oscillators = [
                {freq: 440, type: 'sine', gain: 0.2},
                {freq: 880, type: 'square', gain: 0.1},
            ];
            var t = 0;
            for(var i=0;i<this.oscillators.length;i++) {
                var oscillator = this.rack.context.createOscillator();
                oscillator.type = this.oscillators[i].type;
                oscillator.frequency.value = this.oscillators[i].freq;
                var gain = this.rack.context.createGain();
                gain.gain.value = this.oscillators[i].gain;
                oscillator.connect(gain);
                gain.connect(this.rack.visualiser);
                oscillator.start(t);
                this.oscillators[i].oscillator = oscillator;
            }

        }
    });

    return new Synth();
});