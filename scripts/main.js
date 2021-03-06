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
        "jquery": ["lib/jquery/dist/jquery"],
        "numeric": ["lib/numericjs/src/numeric"]
    },
    shim: {
        "numeric": {
            exports: "numeric"
        }
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
    'plugins/drumkit',
    'plugins/timeline',
    'plugins/oscillator'

    ], function(
        DAW, Sampler, Editor, Visualiser, Analyzer, Synth, Sequencer,
        Mixer, Delay, Keyboard, Filter, Noise, Compressor,
        Drumkit, Timeline, Oscillator) {

    DAW.initialize({
        duration: 10,
        buffer_size: 1024,
        bpm: 120
    });

    DAW.insert('#buffer', new Visualiser(), {
        title: 'Buffer'
    });

    var compressor = new Compressor();
    DAW.insert('#buffer', compressor);

    DAW.insert('#analyser', new Analyzer(), {
        title: 'Spectrogram',
        fft_size: 256,
        height: 128
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
    DAW.insert('#mixer', mixer);

    mixer.connect(sampler);

    var drum = new Drumkit();
    var sequencer = new Sequencer();
    DAW.insert('#drums', sequencer, {
        range: 8
    });

    sequencer.control(drum);

    DAW.load('api/patterns/1', function(data) {
        sequencer.loadPattern(data);
    });

    DAW.insert('#drums', drum);

    var lowShelf = new Filter();
    var noise = new Noise();

    DAW.insert('#strings', lowShelf, {
        title: 'Drum filter'
    });
    DAW.insert('#strings', noise);

    lowShelf.connect(drum);

    mixer.connect(lowShelf);

    var bass = new Synth();
    var bassSeq = new Sequencer();
    DAW.load('api/patterns/2', function(data) {
        bassSeq.loadPattern(data);
    });

    bassSeq.control(bass);
    DAW.insert('#drums', bassSeq, {
        len: 32,
        height: 150
    });

    DAW.insert('#drums', bass, {
        title: 'Bass',
        modes: [2, 4, 5, 8],
        envelope: {
            p0: Bezier.point(0, 1),
            p1: Bezier.point(1, 0),
            c0: Bezier.point(0.4, 0.8),
            c1: Bezier.point(0.6, 0.6)
        },
        len: 20000,
        base_frequency: 110
    });

    mixer.connect(bass);

    var kbd = new Keyboard();
    var melodySynth = new Oscillator();

    DAW.insert('#keyboard', kbd);
    DAW.insert('#keyboard', melodySynth, {
        title: 'Melody'
    });

    var timeline = new Timeline();
    timeline.connect(mixer);
    DAW.insert("#timeline", timeline);

    var delay = new Delay();
    // DAW.insert('#effects', delay, {
    //     title: 'Noise delay'
    // });
    mixer.connect(melodySynth);
    kbd.control(melodySynth);

    //delay.connect(noise);
    mixer.connect(noise);

    // draggable keyboard
    var tb = document.querySelector('.keyboard .titlebar');

    tb.addEventListener('mousedown', function(e) {
        var dx = e.clientX - this.parentNode.offsetLeft;
        var dy = e.clientY - this.parentNode.offsetTop;
        var mMove = function(e) {
            var panel = document.querySelector('.keyboard');
            panel.style.left = (e.clientX - dx) + 'px';
            panel.style.top = (e.clientY - dy) + 'px';
        };
        window.addEventListener('mousemove', mMove, true);
        window.addEventListener('mouseup', function(e) {
            window.removeEventListener('mousemove', mMove, true);
        }, true);
    }, false);

    document.getElementById('main-play').onclick = function() {

        var i = this.querySelector('i');
        if(i.className !== 'fa fa-stop') {
            DAW.start();
            i.className = 'fa fa-stop';
        } else {
            DAW.stop();
            i.className = 'fa fa-play';
        }
    };

});
