/**
 * Encode to MP3 and upload to server
 */
importScripts('lib/requirejs/require.js');

require(['lib/libmp3lame/dist/libmp3lame'], function(lame) {

    var mp3codec, blob, stage1 = false, stage2 = false;

    try {
        var formData = new FormData();
        postMessage('ready');
    } catch(e) {
        postMessage('Error: ' + e.message);
        return;
    }

    var upload = function() {

        if(!stage1 || !stage2) {
            return;
        }

        postMessage('Uploading to server...');
        var req = new XMLHttpRequest();
        req.open("POST", '../api/songs', true);

        req.onreadystatechange = function() {
            if (req.readyState === 4) {
                postMessage('done');
            }
        };

        req.send(formData);
    };

    onmessage = function(msg) {

        if(msg.data.email !== undefined) {


            formData.append('email', msg.data.email);
            formData.append('name', msg.data.name);

            stage1 = true;

            upload();


        } else {

            var size = msg.data.length;

            mp3codec = Lame.init();

            Lame.set_mode(mp3codec, Lame.MONO);
            Lame.set_num_channels(mp3codec, 1);
            Lame.set_num_samples(mp3codec, size);

            Lame.set_in_samplerate(mp3codec, 44100);
            Lame.set_out_samplerate(mp3codec, 44100);

            Lame.set_bitrate(mp3codec, 128);

            Lame.init_params(mp3codec);

            postMessage('Encoding...');

            var buff = new Float32Array(size);

            for (var i = 0; i < size; i++) {
                buff[i] = msg.data[i];
            }

            var mp3data = Lame.encode_buffer_ieee_float(mp3codec, buff, buff);

            Lame.encode_flush(mp3codec);

            blob = new Blob([new Uint8Array(mp3data.data)], {
                type: 'audio/mp3'
            });
            formData.append('data', blob);

            Lame.close(mp3codec);

            mp3codec = null;

            postMessage('encoded');
            stage2 = true;
            upload();

        }
    }
});
