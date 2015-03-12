/**
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

const FULL_CIRCLE = Math.PI * 2;

define('plugins/synth', ['Gadget', 'jquery'], function(Gadget, $) {

    var Synth = Gadget.extend({

        notes: [],
        note: null,
        on: false,
        started: null,

        init: function() {
            this._super();
            var f = 440;
            for(var i=0;i<12;i++) {
                this.notes.push(f);
                f = f * Math.pow(2, 1/12);
            }
        },
        over: 0,
        redraw: function() {

            this.clear();
            if(this.on) {
                var w = this.canvas.width / 12;
                this.context.beginPath();
                this.context.arc(this.x, this.y, 10, 0, FULL_CIRCLE);
                this.context.fill();
            }
        },

        update: function() {
            if(this.on && this.started && (Date.now() - this.started) > 100) {
                this.oscillator.stop();
                this.oscillator.disconnect(this.gain);
                this.on = false;
                this.started = null;
            }
        },

        onMouseMove: function(event) {
        },

        onClick: function(event) {
            // only one note can be played at a time
            if(this.on) {
                return;
            }
            this.on = true;

            this.started = Date.now();
            var $canvas = $(this.canvas);
            this.x = event.clientX - $canvas.offset().left;
            this.y = event.clientY - $canvas.offset().top;
            this.note = Math.floor(this.x / ($canvas.width() / 12));

            var oscillator = this.rack.context.createOscillator();
            oscillator.type = 'sine';
            this.oscillator = oscillator;
            this.oscillator.frequency.value =
                this.notes[this.note];
            this.oscillator.connect(this.gain);

            var delay = this.rack.context.createDelay();
            delay.delayTime.value = .3;

            var feedback = this.rack.context.createGain();
            feedback.gain.value = 0.4;

            feedback.connect(delay);
            delay.connect(feedback);

            this.oscillator.connect(delay);
            delay.connect(this.gain);
            this.oscillator.start();

        },

        initialize: function() {
            this._super();

            var gain = this.rack.context.createGain();
            gain.gain.value = 0.2; // start from min
            gain.connect(this.rack.visualiser);
            this.gain = gain;
        }
    });

    return new Synth();
});