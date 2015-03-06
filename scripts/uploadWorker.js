importScripts('lib/requirejs/require.js');

require.config({
	baseUrl: 'util'
});

require(['riff'], function(Riff) {

	postMessage('ready');

	onmessage = function(msg) {
		
		var arr = JSON.parse(msg.data);

		var len = 48000 * 10;                // 10 seconds
		var fsize = len + 44;
		var buffer = new ArrayBuffer(fsize);
		var dataView = new DataView(buffer);

		var riff = new Riff(dataView);

		// RIFF chunk (12 bytes)
		riff.appendUTFBytes('RIFF');         // ID
		riff.appendUint32(fsize);            // total size
		riff.appendUTFBytes('WAVE');         // type

		// FORMAT chunk (24 bytes)
		riff.appendUTFBytes('fmt ');
		riff.appendUint32(0x10);             // size (16 bytes)
		riff.appendUint16(0x01);
		riff.appendUint16(0x01);             // mono
		riff.appendUint32(44800);            // sample rate Hz
		riff.appendUint32(44800);            // bytes per second
		riff.appendUint16(1);                // 1 byte per sample
		riff.appendUint16(8);                // 8 bits per sample

		// DATA chunk (8 bytes)
		riff.appendUTFBytes('data');
		riff.appendUint32(len);

		// data
		for(var i=0;i<len;i++) {
			riff.appendUint8(arr[i] * 256 - 128);   // 8 bit music
		}

		var blob = new Blob([riff.view], {
			type: "audio/wav"
		});

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

	};

});
