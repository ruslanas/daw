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
 	'plugins/editor',
 	'plugins/visualiser',
 	'plugins/analyzer',
 	'jquery'
 	], function(DAW, editor, visualiser, analyzer, $) {

	DAW.initialize();

	DAW.plug('#visualiser', visualiser);
	DAW.plug('#editor', editor);
	DAW.plug('#analyzer', analyzer);

	DAW.load();

});
