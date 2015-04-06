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
    'plugins/compressor',
    'plugins/drumkit'

    ], function(
        DAW, Sampler, Editor, Visualiser, Analyzer, Synth, Sequencer,
        Mixer, Delay, Keyboard, Filter, Noise, Compressor, Drumkit) {

    DAW.initialize({
        duration: 10,
        buffer_size: 1024,
        bpm: 180
    });

    DAW.insert('#buffer', new Visualiser(), {
        title: 'Buffer'
    });

    var compressor = new Compressor();
    DAW.insert('#buffer', compressor);

    DAW.insert('#analyser', new Analyzer(), {
        title: 'Analyser',
        fft_size: 128
    });

    var mixer = new Mixer();
    var sampler = new Sampler();

    DAW.insert('daw-playlist', sampler, {
        hidden: true
    });

    //load tracks
    var url = document.querySelector('daw-playlist').getAttribute('src');
    DAW.load(url, function(data) {
        sampler.loadTracks(data);
    });

    DAW.insert('#analyser', new Editor());
    DAW.insert('#wide', mixer);

    mixer.connect(sampler);

    var drum = new Drumkit();
    var sequencer = new Sequencer();
    DAW.insert('#drums', sequencer, {
        range: 10
    });

    sequencer.control(drum);

    DAW.load('api/patterns/1', function(data) {
        sequencer.loadPattern(data);
    });

    DAW.insert('#drums', drum);

    var lowShelf = new Filter();
    var noise = new Noise();

    DAW.insert('#strings', lowShelf);
    DAW.insert('#strings', noise);

    lowShelf.connect(drum);

    mixer.connect(lowShelf);
    mixer.connect(drum);

    var bass = new Synth();
    var bassSeq = new Sequencer();
    DAW.load('api/patterns/2', function(data) {
        bassSeq.loadPattern(data);
    });

    bassSeq.control(bass);
    DAW.insert('#drums', bassSeq, {
        len: 32
    });

    DAW.insert('#drums', bass, {
        title: 'Bass',
        modes: [2, 4, 6],
        len: 30000,
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
        title: 'Noise delay'
    });
    mixer.connect(melodySynth);
    kbd.control(melodySynth);

    delay.connect(noise);
    mixer.connect(delay);

    document.getElementById('main-play').onclick = function() {

        var i = this.querySelector('i');
        if(i.className !== 'fa fa-pause') {
            DAW.start();
            i.className = 'fa fa-pause';
        } else {
            DAW.stop();
            i.className = 'fa fa-play';
        }
    };

});
