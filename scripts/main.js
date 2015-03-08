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
 	'plugins/analyzer',
 	'jquery'
 	], function(DAW, sampler, editor, visualiser, analyzer, $) {

	DAW.initialize({
		duration: 5
	});

	DAW.plug('#narrow', visualiser);
	DAW.plug('#narrow', analyzer);
	DAW.plug('#wide', editor);

	DAW.plug('#wide', sampler, {
		hidden: true
	});

	// load tracks
	DAW.load(function(data) {
		sampler.loadTracks(data);
	});

	$('#tracks').click(function(e) {
		var audioNode = $(e.target).closest('a').next()[0];
		$(audioNode).closest('div').addClass('playing');
		audioNode.play();
		audioNode.onended = function() {
			$(audioNode).closest('div').removeClass('playing');
			$(audioNode).closest('div').next().find('a').click();
		};

		return false;
	});
});
