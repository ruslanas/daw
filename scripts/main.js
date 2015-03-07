navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

require.config({
	baseUrl: "scripts",
	paths: {
		"jquery": ["lib/jquery/dist/jquery"]
	}
});

require([
	'daw',
	'plugins/sampler',
 	'plugins/editor',
 	'plugins/visualiser',
 	'plugins/analyzer'
 	], function(DAW, sampler, editor, visualiser, analyzer) {

	DAW.initialize();

	DAW.plug('#narrow', visualiser);
	DAW.plug('#narrow', analyzer);
	DAW.plug('#wide', editor);

	DAW.plug('#tracks', sampler, {
	 	url: 'test.mp3'
	});

	// load tracks
	DAW.load();

});
