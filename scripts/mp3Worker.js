importScripts('lib/requirejs/require.js');

require(['lib/libmp3lame/dist/libmp3lame'], function(lame) {

	var mp3codec;

	postMessage('ready');

	onmessage = function(msg) {

		// recreate Float32Array
		var size = 48000 * 10;
		var parsed = JSON.parse(msg.data);

		mp3codec = Lame.init();

		Lame.set_mode(mp3codec, Lame.MONO);
		Lame.set_num_channels(mp3codec, 1);
		Lame.set_num_samples(mp3codec, size);

		Lame.set_in_samplerate(mp3codec, 44100);
		Lame.set_out_samplerate(mp3codec, 44100);

		Lame.set_bitrate(mp3codec, 128);

		Lame.init_params(mp3codec);
		console.log('Version :', Lame.get_version() + ' / ',
			'Mode: '+Lame.get_mode(mp3codec) + ' / ',
			'Samples: '+Lame.get_num_samples(mp3codec) + ' / ',
			'Channels: '+Lame.get_num_channels(mp3codec) + ' / ',
			'Input Samplate: '+ Lame.get_in_samplerate(mp3codec) + ' / ',
			'Output Samplate: '+ Lame.get_in_samplerate(mp3codec) + ' / ',
			'Bitlate :' +Lame.get_bitrate(mp3codec) + ' / ',
			'VBR :' + Lame.get_VBR(mp3codec));

		postMessage('Encoding...');

		var buff = new Float32Array(size);

		for(var i=0;i<size;i++) {
			buff[i] = parsed[i];
		}

		var mp3data = Lame.encode_buffer_ieee_float(mp3codec, buff, buff);


		postMessage('Done encoding.');

		Lame.encode_flush(mp3codec);

		var blob = new Blob([new Uint8Array(mp3data.data)], {type: 'audio/mp3'});

		var fd = new FormData();
		fd.append('fname', '8bit.wav');
		fd.append('data', blob);		

		var req = new XMLHttpRequest();
		req.open("POST", '../upload.php', true);

		req.onreadystatechange = function() {
			if(req.readyState === 4) {
				postMessage('done');
			}
		};

		req.send(fd);


		Lame.close(mp3codec);

		mp3codec = null;

		postMessage('done');
	}
});