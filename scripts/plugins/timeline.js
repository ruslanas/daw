/**
 * Timeline
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/timeline', [
    'Gadget'
    ], function(Gadget) {

    var Timeline = Gadget.extend({

        samples: null, // track buffers
        tracks: null,  // parameters of loaded tracks
        sources: null, // reference array to buffer source nodes
        h: 10,         // track height
        help: "You can drag & drop files from playlist",

        init: function() {
            this._super();
            this.title = 'Timeline';
            this.samples = [];
            this.gains = [];
            this.sources = [];
            this.height(150);
        },

        connect: function(mixer) {
            this.mixer = mixer;
        },

        redraw: function() {
            this.clear();
            var scale = this.rack.bpm / 60;
            for(var i=0;i<this.tracks.length;i++) {
                this.hline(this.h * (i + 1), 0.5);
                if(this.samples[i] === undefined) {
                    continue;
                }

                var width = scale * this.samples[i].length / this.audio.sampleRate;
                var x = this.tracks[i].x;

                this.context.fillRect(x, i * this.h, width, this.h);
                this.context.fillStyle = '#000';
                this.context.fillText(this.tracks[i].title, x + 2, i * this.h + this.h - 2);
                this.context.fillStyle = this.color;

            }

            if(this.rack.started) {
                var real = this.elapsed / scale;
                var s = real % 60;
                s = s.toFixed(2).length == 5 ? s.toFixed(2) : '0' + s.toFixed(2);
                var t = Math.floor(real / 60) + ':' + s;
                this.context.fillText(t, this.elapsed + 2, this.height() - 2);
                this.vline(this.elapsed, 0.5, '#FF0');
            }

            this.updated = false;
        },

        getElapsed: function() {
            return this.audio.currentTime - this.rack.started;
        },

        // on beat
        update: function() {
            this.elapsed = this.getElapsed() * this.rack.bpm / 60;
            this.updated = true;
        },


        onMouseDown: function(e) {
            this.down = this.tracks[Math.floor(this.getY(e) / this.h)];
            this.shift = this.getX(e) - this.down.x;
        },

        onChange: function(e) {
            if(this.on) {
                this.clean();
                this.start();
            }
            if(this.down) {
                this.down.x = Math.max(0, this.getX(e) - this.shift);
            }
            this.updated = true;
        },

        onMouseMove: function(e) {
            this.onChange(e);
        },

        onMouseUp: function(e) {
            this.down = null;
            this.onChange(e);
        },

        onDrop: function(e) {

            var x = this.getX(e);
            var y = this.getY(e);
            var idx = Math.floor(this.tracks.length * y / this.height());
            var url = e.dataTransfer.getData('text');
            this.tracks[idx] = {
                x: x,
                y: y,
                url: url,
                title: url.split('/').pop()
            }

            var self = this;
            this.rack.loadBuffer(url, function(buffer) {

                self.samples[idx] = buffer;
                self.tracks[idx].buffer = buffer;
                self.updated = true;
                self.onChange(e);
            });
        },

        clean: function() {
            this.on = false;
            for(var i=0;i<this.sources.length;i++) {
                try {
                    this.sources[i].stop();
                } catch(e) {
                    this.rack.setStatus(e.message);
                }
            }
            this.sources = [];
        },

        start: function() {
            this.on = true;
            var scale = this.rack.bpm / 60;

            var idx = 0;
            for(var i=0;i<this.samples.length;i++) {
                if(!this.samples[i]) {
                    continue;
                }

                this.sources[idx] = this.audio.createBufferSource();
                this.sources[idx].buffer = this.samples[i];
                var gain = this.gains[i];
                this.sources[idx].connect(gain);

                var time = this.tracks[i].x / scale - this.getElapsed();

                var self = this;
                this.sources[idx].onended = function() {

                    if(!self.sources[idx]) {
                        return;
                    }

                    self.sources[idx].disconnect(gain);
                    self.sources[idx].onended = null;
                    self.sources[idx] = null;
                    self.rack.setStatus('Buffer source freed');
                };

                if(time < 0) {
                    this.sources[idx].start(0, -time);
                } else {
                    this.sources[idx].start(this.audio.currentTime + time);
                }
                idx++;
            }
        },

        initialize: function() {
            this._super();
            var self = this;

            this.tracks = new Array(4);

            if(!this.mixer) {
                throw 'Mixer not connected';
            }

            for(var i=0;i<this.tracks.length;i++) {
                this.gains[i] = this.audio.createGain();
                this.gains[i].gain.value = 0.9;

                this.mixer.connect({
                    out: this.gains[i],
                    title: 'track ' + i
                });
            }

            this.h = this.canvas.height / this.tracks.length;


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

        }
    });

    return Timeline;
});
