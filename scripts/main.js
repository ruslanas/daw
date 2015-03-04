navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

require.config({
	baseUrl: "scripts",
	paths: {
		"jquery": ["lib/jquery/dist/jquery"]
	}
});

require(['daw', 'editor'], function(DAW, visualiser) {
	DAW.initialize();

	DAW.plug('#editor', visualiser);
});
