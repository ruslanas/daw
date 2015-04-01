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

        playNote: function(note, time) {
            time = time || 0;

            var self = this;

            var buffSrc = this.audio.createBufferSource();

            buffSrc.buffer = this.samples[note];
            buffSrc.connect(this.out);

            buffSrc.onended = function() {
                buffSrc.disconnect(self.out);
                buffSrc.onended = null;
                buffSrc = null;
            }

            buffSrc.start(time);

        },

        // gadget inserted and attached
        initialize: function() {
            this._super();

            var amp = this.audio.createGain();
            amp.gain.value = this.gain;

            this.out = amp;

        }
    });

    return BaseSynth;
});
