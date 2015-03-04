define('daw', ['jquery'], function($) {
	return {
		initialize: function() {

			$('#frame').change(function() {
				pos = $(this).val();
			});
			
			$(window).bind('wheel', function(e) {
				var newPos = parseInt(pos) - e.originalEvent.deltaY / 100;
				if(e.ctrlKey) {
					step = (step > 0) ? step + e.originalEvent.deltaY / 100 : 1;
				} else {
					$('#frame').val(newPos).change();
				}
				return false;
			});

			init();
		}
	}
});

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

var buffer = [];
var sampleBuffLen = 44100 * 10;
var sample = new Float32Array(sampleBuffLen);
var canvas, ctx;
var visualiser, mic, recorder; // nodes
var pos = 0;
var coef = 65535 / 200;
var recordFrameLen = 1024;
var step = 16;

function pause() {
	recorder.disconnect(visualiser);

	if(player) {
		player.disconnect(visualiser);
	}

	$('#pause-btn').attr('disabled', 'disabled');
	$('#play-btn').removeAttr('disabled');
	$('#record-btn').removeAttr('disabled');

}

var player;

function play() {
	$('#pause-btn').removeAttr('disabled');
	$('#play-btn').attr('disabled', 'disabled');

	player = context.createBufferSource();

	player.buffer = context.createBuffer(1, sample.length, 44100);
	var ch = player.buffer.getChannelData(0);

	ch.set(sample);

	player.connect(visualiser);

	player.start(0);

	player.onended = function() {
		pause();
	};
}

function record() {
	pos = 0;
	$('#record-btn').attr('disabled', 'disabled');
	$('#pause-btn').removeAttr('disabled');

	recorder.connect(visualiser);

}

function init() {

	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	editorCanvas = document.getElementById('editor');
	editorContext = editorCanvas.getContext('2d');

	navigator.getUserMedia({audio: true}, function(stream) {

		mic = context.createMediaStreamSource(stream);
		mic.connect(recorder);

		visualiser.connect(context.destination);

	}, function(err) {
		console.log(err);
	});

	visualiser = context.createScriptProcessor(512, 1, 1);

	// update visualiser buffer
	visualiser.onaudioprocess = function(e) {

		buffer = e.inputBuffer.getChannelData(0);
		var output = e.outputBuffer.getChannelData(0);
		output.set(buffer);
	}
	recorder = context.createScriptProcessor(recordFrameLen, 1, 1);
	recorder.onaudioprocess = function(e) {
		var input = e.inputBuffer.getChannelData(0);

		// add frame to buffer
		appendFrame(input, recordFrameLen);

		var output = e.outputBuffer.getChannelData(0);
		output.set(input);
	}

	ctx.fillStyle = '#F00';
	editorContext.fillStyle = '#FF0';

	setInterval(function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		var h = canvas.height / 2;

		for(var i=0;i<buffer.length;i++) {
			var height = buffer[i] * coef;
			ctx.fillRect(i, h + height, 1, 1);
		}
	}, 1000 / 30);

	setInterval(function() {
		updateEditorView();
	}, 1000 / 10);
	
}

function updateEditorView() {
	// update wave editor

	var m = 0;
	editorContext.clearRect(0,0,editorCanvas.width,editorCanvas.height);

	for(var i=0;i<editorCanvas.width * step;i+=2) {
		var a = coef * sample[pos * recordFrameLen - m] / 10;
		editorContext.fillRect(editorCanvas.width - i, editorCanvas.height / 2, 1, a + 1);
		m += step;
	}

}

function appendFrame(buff, length) {
	var end = length * pos;
	if(end + length > sampleBuffLen) {
		pause();
		return;
	}

	sample.set(buff, end);
	$('#frame').val(pos);
	pos++;
}
