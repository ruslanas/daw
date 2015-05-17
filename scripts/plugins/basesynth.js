/**
 * Synthesizer
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/basesynth', [
    'Gadget'
    ], function(Gadget) {

    var BaseSynth = Gadget.extend({

        notes: [],
        gains: [],
        note: null,
        on: false,
        status: '',
        bend: 0.5,
        sequencer: null,
        samples: [],
        modes: [],
        gain: 1,
        out: null,
        down: false,
        baseFreq: 440,

        init: function() {
            this._super();

            this.title = 'Synthesizer';
            this.notes = [];
            this.samples = [];

        },

        redraw: function() {
            // void
        },

        onReady: function(done) {
            done();
        },

        // gadget inserted and attached
        initialize: function() {
            this._super();

            this.baseFreq = this.options.base_frequency || this.baseFreq;

            var amp = this.audio.createGain();
            amp.gain.value = this.gain;

            this.out = amp;
        }
    });

    return BaseSynth;
});
