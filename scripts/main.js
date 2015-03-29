/**
 * Modular Audio Application Framework <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

// polyfill
navigator.getUserMedia = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia
    || function() {};
window.AudioContext = window.AudioContext
    || window.webkitAudioContext
    || function() {};

require.config({
    baseUrl: "scripts",
    paths: {
        "jquery-mousewheel": ["lib/jquery-mousewheel/jquery.mousewheel"],
        "jquery": ["lib/jquery/dist/jquery"]
    }
});

require([
    'daw',
    'plugins/sampler',
    'plugins/editor',
    'plugins/visualiser',
    'plugins/analyzer',
    'plugins/synth',
    'plugins/sequencer',
    'plugins/mixer',
    'plugins/delay',
    'plugins/keyboard',
    'plugins/filter',
    'plugins/noise',

    ], function(
        DAW, Sampler, Editor, Visualiser, Analyzer, Synth, Sequencer,
        Mixer, Delay, Keyboard, Filter, Noise) {

    DAW.initialize({
        duration: 60,
        buffer_size: 1024,
        bpm: 180
    });

    DAW.insert('#buffer', new Visualiser(), {
        title: 'Buffer'
    });

    DAW.insert('#analyser', new Analyzer(), {
        title: 'Analyser',
        fft_size: 256
    });

    var sampler = new Sampler();

    DAW.insert('daw-playlist', sampler, {
        hidden: true
    });

    //load tracks
    var url = document.querySelector('daw-playlist').getAttribute('src');
    DAW.load(url, function(data) {
        sampler.loadTracks(data);
    });

    var mixer = new Mixer();

    DAW.insert('#wide', new Editor());
    DAW.insert('#effects', mixer);

    var drum = new Synth();
    var sequencer = new Sequencer();

    sequencer.control(drum);

    DAW.insert('#drums', sequencer);
    sequencer.pattern = [
        1, -1, -1, -1,
        1, -1, -1, -1,
        1, -1, -1, -1,
        1, -1, -1, -1
    ];

    DAW.insert('#drums', drum, {
        title: 'Rythm',
        modes: [1.59, 1.35, 1.67, 1.99, 2.3, 2.61],
        base_frequency: 110,
        noise: 0.1,
        len: 20000
    });

    var lowShelf = new Filter();
    var noise = new Noise();

    DAW.insert('#strings', lowShelf);
    DAW.insert('#strings', noise);

    lowShelf.connect(noise);

    mixer.connect(lowShelf);
    mixer.connect(drum);

    var bass = new Synth();
    var bassSeq = new Sequencer();
    bassSeq.control(bass);
    DAW.insert('#drums', bassSeq, {
        len: 32
    });

    DAW.insert('#drums', bass, {
        title: 'Bass',
        modes: [2, 3, 4, 5, 6, 7, 8],
        base_frequency: 55
    });
    mixer.connect(bass);

    var kbd = new Keyboard();
    var melodySynth = new Synth();

    DAW.insert('#keyboard', kbd);
    DAW.insert('#keyboard', melodySynth, {
        title: 'Melody',
        base_frequency: 110,
        modes: [2, 4, 6],
        len: 40000
    });

    var delay = new Delay();
    DAW.insert('#effects', delay, {
        title: 'Melody'
    });
    delay.connect(melodySynth)
    kbd.control(melodySynth);
    mixer.connect(delay);

});
