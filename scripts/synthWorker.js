importScripts('bezier.js');

onmessage = function(msg) {

    var cycle = msg.data.sampleRate / msg.data.freq;

    var len = msg.data.len;

    var buff = new Float32Array(len);

    // fill samples
    for(var j=0;j<len;j++) {
        buff[j] = Math.sin(2 * Math.PI * j / cycle);
        var c = 1;
        for(var k=0;k<msg.data.modes.length;k++) {
            buff[j] += Math.sin(msg.data.modes[k] * 2 * Math.PI * j / cycle) * c;
            c *= 0.5;
        }
        if(msg.data.noise) {
            buff[j] += Math.random() * msg.data.noise;
        }
    }

    var points = msg.data.bezier;

    var envelope = new Bezier(
            points.p0, points.p1, points.c0, points.c1);

    var t = [];
    for(var i=0;i<buff.length;i++) {
        var coords = envelope.getCoordinates(i / buff.length);
        if(coords.x >= 0 && coords.x <= 1) {
            t[Math.floor(coords.x * buff.length)] = coords.y;
        }
    }

    // fill missing values
    t[0] = 0;
    for(var i=0;i<buff.length;i++) {
        if(t[i] === undefined) {
            t[i] = t[i-1]; // fill missing values
        }
        buff[i] *= t[i];
    }

    var out = {
        idx: msg.data.idx,
        buff: buff,
        len: msg.data.len
    };

    postMessage(out);
}