/**
 * Drumkit
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/drumkit', [
    'plugins/basesynth'
    ], function(BaseSynth) {

    var Drumkit = BaseSynth.extend({

        init: function() {
            this._super();
            this.title = 'Drumkit';
        },

        redraw: function() {
            this.clear();
            for(var i=0;i<this.knobs.length;i++) {
                var knob = this.knobs[i];
                if(knob !== undefined) {
                    this.drawKnob(knob.x, knob.y, this.gains[i].gain.value);
                }
            }
            this.context.fillText(this.status, 2, this.height() - 2);
        },

        onMouseDown: function(event) {
            var idx = Math.floor(this.getX(event) / 25);
            this.y = this.getY(event);
            this.down = this.gains[idx];
            this.setStatus(this.knobs[idx].name);
        },

        onMouseUp: function(event) {
            this.down = false;
            this.setStatus('');
        },

        onMouseMove: function(event) {
            if(!this.down) {
                return;
            }
            var dy = this.y - this.getY(event);
            var val = this.down.gain.value + 0.1 * dy / this.height();
            // clamp
            this.down.gain.value = Math.min(1, Math.max(0, val));
        },

        loadBuffer: function(idx, url) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            var self = this;
            request.onload = function() {
                var audioData = request.response;
                self.audio.decodeAudioData(audioData, function(buffer) {
                    self.gains[idx] = self.audio.createGain();
                    self.gains[idx].connect(self.out);
                    self.gains[idx].gain.value = 0.9;
                    self.samples[idx] = buffer;
                    self.knobs[idx] = {
                        x: idx * 25 + 15,
                        y: self.baseline,
                        val: 1,
                        name: url
                    };
                }, function(e) {
                    console.log(e);
                });
            }
            request.send();
        },

        initialize: function() {
            this._super();

            this.knobs = new Array(9);
            this.gains = new Array(9);

            this.loadBuffer(0, 'waves/base.wav');
            this.loadBuffer(1, 'waves/tom.wav');
            this.loadBuffer(2, 'waves/snare2.wav');
            this.loadBuffer(3, 'waves/crash.wav');
            this.loadBuffer(4, 'waves/hihat.wav');
            this.loadBuffer(5, 'waves/hihat2.wav');
            this.loadBuffer(6, 'waves/kick.ogg');
            this.loadBuffer(7, 'waves/kick2.wav');
            this.loadBuffer(8, 'waves/kick3.wav');
        }
    });

    return Drumkit;
});
