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

        loadBuffer: function(idx, url) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            var self = this;
            request.onload = function() {
                var audioData = request.response;
                self.audio.decodeAudioData(audioData, function(buffer) {
                    self.samples[idx] = buffer;
                }, function(e) {
                    console.log(e);
                });
            }
            request.send();
        },

        initialize: function() {
            this._super();

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
