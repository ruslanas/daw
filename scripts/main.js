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

	DAW.plug('#narrow', visualiser, {
		title: ' '
	});
	DAW.plug('#narrow', analyzer, {
		title: ' '
	});
	DAW.plug('#wide', editor, {
		title: 'Recorded waveform'
	});

	DAW.plug('#wide', sampler, {
		hidden: true
	});

	// load tracks
	DAW.load(function(data) {
		sampler.loadTracks(data, function() {
			$('#tracks div:first-child a').click();
		});
	});

	$('#tracks').click(function(e) {
		// stop all playing
		$('.playing').find('audio').each(function() {
			$(this)[0].pause();
			$(this).closest('.playing').removeClass('playing');
		});

		var audioNode = $(e.target).closest('a').next()[0];
		$(audioNode).closest('div').addClass('playing');
		audioNode.play();
		audioNode.onended = function() {
			$(audioNode).closest('div').next().find('a').click();
		};

		return false;
	});
});
