/**
 * Timeline
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/timeline', ['Gadget'], function(Gadget) {

    var Timeline = Gadget.extend({

        samples: null,
        tracks: null,

        init: function() {
            this._super();
            this.title = 'Timeline';
            this.samples = [];
            this.gains = [];
            this.tracks = [];
            this.height(150);
        },

        redraw: function() {
            for(var i=0;i<this.samples.length;i++) {
                var width = 5 * this.samples[i].length / this.audio.sampleRate;
                this.context.fillRect(this.tracks[i].x, i * 10, width, 10);
            }
            this.updated = false;
        },

        onDrop: function(e) {

            var idx = this.samples.length;
            this.tracks[idx] = {
                x: this.getX(e)
            }

            this.loadBuffer(idx, e.dataTransfer.getData('text'));
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
                    self.gains[idx].gain.value = 0.5;
                    self.knobs[idx] = {
                        x: idx * 25 + 15,
                        y: self.baseline,
                        val: 1,
                        name: url
                    };

                    self.samples[idx] = buffer;

                    self.updated = true;
                }, function(e) {
                    console.log(e);
                });

            };

            request.send();
        },

        initialize: function() {
            this._super();
            var self = this;
            this.canvas.addEventListener('drop', function(e) {
                e.stopPropagation();
                e.preventDefault();
                self.onDrop(e);
            }, false);

            this.canvas.addEventListener('dragover', function(e) {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            }, false);
            this.out = this.audio.createGain();
        }
    });

    return Timeline;
});