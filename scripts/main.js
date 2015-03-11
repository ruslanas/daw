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
 	'plugins/synth'
 	], function(DAW, sampler, editor, visualiser, analyzer, synth) {

	DAW.initialize({
		duration: 5,
		buffer_size: 2048
	});

	DAW.plug('#narrow', visualiser, {
		title: ' '
	});

	DAW.plug('#narrow', analyzer, {
		title: ' '
	});

	DAW.plug('#wide', editor, {
		title: ' '
	});

	DAW.plug('daw-playlist', sampler, {
		hidden: true
	});

	// load tracks
	var url = document.querySelector('daw-playlist').getAttribute('src');
	DAW.load(url, function(data) {
		sampler.loadTracks(data);
	});

});
