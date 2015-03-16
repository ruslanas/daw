/**
 * Modular Audio Application Framework <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

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

 	], function(DAW, Sampler, Editor, Visualiser, Analyzer, Synth, Sequencer) {

	DAW.initialize({
		duration: 30,
		buffer_size: 2048,
		bpm: 140
	});

	DAW.plug('#narrow', new Visualiser(), {
		title: 'Buffer'
	});

	DAW.plug('#narrow', new Analyzer(), {
		title: ' '
	});

	var sampler = new Sampler();

	DAW.plug('daw-playlist', sampler, {
		hidden: true
	});

	// load tracks
	var url = document.querySelector('daw-playlist').getAttribute('src');
	DAW.load(url, function(data) {
		sampler.loadTracks(data);
	});

	DAW.plug('#wide', new Editor(), {
		title: ''
	});

	var drum = new Synth();
	var sequencer = new Sequencer();

	//drum.modes = [2.3, 3.6];
	drum.modes = [1.59, 1.35, 1.67, 1.99, 2.3, 2.61];
	drum.len = 25000;
	//drum.noise = 0.1;

	sequencer.pattern = [
		1, -1, -1, -1,
		1, -1, -1, -1,
		1, -1, -1, -1,
		1, -1, -1, -1
	];

	sequencer.synth = drum;

	DAW.plug('#wide', sequencer);
	DAW.plug('#wide', drum);

	var synth2 = new Synth();

	synth2.modes = [2, 3, 4, 5, 6];
	synth2.len = 12000;
	synth2.gain = 0.3;
	synth2.bezierPoints = {
        p0: Bezier.point(0, 0),
        p1: Bezier.point(1, 0),
        c0: Bezier.point(0, 1),
        c1: Bezier.point(0, 0.2)
	};

	var sequencer2 = new Sequencer();

	synth2.onReady(function() {
		sequencer2.on = true;
	});

	sequencer2.synth = synth2;

	DAW.plug('#wide', sequencer2);
	DAW.plug('#wide', synth2);

});
