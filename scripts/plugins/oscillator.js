/**
 * Oscillator
 * Modular Audio Application Framework Core Plugin
 * @author Ruslanas Balciunas <http://daw.wri.lt>
 */

"use strict";

define('plugins/oscillator', [
    'plugins/basesynth'
    ], function(BaseSynth) {

    var Oscillator = BaseSynth.extend({

        sources: null,
        notes: null,
        waveForm: 'triangle',

        init: function() {
            this._super();
            this.baseFreq = 220;
            this.title = 'Sampler';
        },

        redraw: function() {
            // draw to this.context
        },

        playNote: function(note) {
            if(this.sources[note]) {
                return;
            }

            var oscillator = this.audio.createOscillator();
            oscillator.connect(this.out);
            oscillator.type = this.waveForm;
            oscillator.frequency.value = this.notes[note];
            oscillator.start();
            this.sources[note] = oscillator;
        },

        stop: function(note) {
            this.sources[note].stop();
            this.sources[note].disconnect();
            this.sources[note] = null;
        },

        initialize: function() {
            this._super();
            this.out = this.audio.createGain();
            this.sources = [];
            this.notes = [];

            var f = this.baseFreq;
            // for octaves shifted from A to C
            for(var i=0;i<12 * 4 + 3;i++) {
                this.notes.push(f);
                f = f * Math.pow(2, 1 / 12);
            }
        }
    });

    return Oscillator;
});