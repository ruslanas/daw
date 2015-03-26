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
        bpm: 120
    });

    DAW.insert('#buffer', new Visualiser(), {
        title: 'Buffer'
    });

    DAW.insert('#analyser', new Analyzer(), {
        title: 'Analyser',
        fft_size: 512
    });

    var sampler = new Sampler();

    // DAW.insert('daw-playlist', sampler, {
    //     hidden: true
    // });

    // load tracks
    // var url = document.querySelector('daw-playlist').getAttribute('src');
    // DAW.load(url, function(data) {
    //     sampler.loadTracks(data);
    // });

    var mixer = new Mixer();

    DAW.insert('#wide', new Editor());
    DAW.insert('#wide', mixer);

    var drum = new Synth();
    var sequencer = new Sequencer();

    //drum.modes = [2.3, 3.6];
    drum.modes = [1.59, 1.35, 1.67, 1.99, 2.3, 2.61];
    drum.len = 20000;
    drum.baseFreq = 55;
    drum.noise = 0.1;

    sequencer.control(drum);

    DAW.insert('#drums', sequencer);
    sequencer.pattern = [
        1, -1, -1, -1,
        1, -1, -1, -1,
        1, -1, -1, -1,
        1, -1, -1, -1
    ];
    DAW.insert('#drums', drum, {
        title: 'Rythm'
    });

    var lowShelf = new Filter();
    var noise = new Noise();

    DAW.insert('#strings', lowShelf);
    DAW.insert('#strings', noise);

    lowShelf.connect(noise);

    var delay = new Delay();
    DAW.insert('#drums', delay);
    delay.connect(drum);

    mixer.connect(lowShelf);
    mixer.connect(delay);

});
