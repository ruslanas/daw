navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

require.config({
	baseUrl: "scripts",
	paths: {
		"jquery": ["lib/jquery/dist/jquery"]
	}
});

require(['daw', 'editor', 'visualiser'], function(DAW, editor, visualiser) {
	DAW.initialize();

	DAW.plug('#canvas', visualiser);
	DAW.plug('#editor', editor);
});
