/**
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

define('plugins/synth', ['Gadget'], function(Gadget) {

    var Synth = Gadget.extend({

        init: function() {
            this._super();
            this.title = 'Synth';
        },

        redraw: function() {
            this.clear();
            this.context.fillText(this.frequency, 0, this.canvas.height);
        },

        initialize: function() {
            this._super();
            // setup
            this.frequency = 440;
            this.oscillator = this.rack.context.createOscillator();
            this.oscillator.type = 'sine';
            this.oscillator.frequency.value = this.frequency;
            this.oscillator.connect(this.rack.visualiser);
            this.oscillator.start();
        }
    });

    return new Synth();
});