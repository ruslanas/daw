/**
 * Modular Audio Application Framework <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

navigator.getUserMedia = navigator.getUserMedia
	|| navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

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
 	'jquery'
 	], function(DAW, sampler, editor, visualiser, analyzer, synth, $) {

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

	DAW.plug('#wide', sampler, {
		hidden: true
	});

	// DAW.plug('#wide', synth, {
	// 	title: 'Synth'
	// });

	// load tracks
	DAW.load('api/songs', function(data) {
		sampler.loadTracks(data, function(data) {
			// void
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
