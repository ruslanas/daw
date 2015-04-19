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

        dx: 0,

        init: function() {
            this._super();
            this.title = 'Drumkit';
        },

        redraw: function() {
            this.clear();
            for(var i=0;i<this.knobs.length;i++) {
                var knob = this.knobs[i];
                if(knob !== undefined) {
                    this.drawKnob(knob, this.gains[i].gain.value);
                }
            }
            this.updated = false;
        },

        onMouseDown: function(event) {
            var idx = Math.floor(this.getX(event) / this.dx);
            this.y = this.getY(event);
            this.down = this.gains[idx];
            this.updated = true;
        },

        onMouseUp: function(event) {
            this.down = false;
            this.updated = true;
        },

        onMouseMove: function(event) {

            if(!this.down) {
                return;
            }

            var dy = this.y - this.getY(event);
            var val = this.down.gain.value + 0.5 * dy / this.height();
            // clamp
            this.down.gain.value = Math.min(1, Math.max(0, val));
            this.updated = true;
        },

        loadBuffer: function(idx, url) {
            var self = this;
            this.rack.loadBuffer(url, function(buffer) {
                self.samples[idx] = buffer;
                self.updated = true;
            });
        },

        initialize: function() {
            this._super();
            var self = this;
            this.rack.load('api/drumkits/1', function(data) {
                self.knobs = new Array(data.length);
                self.gains = new Array(data.length);
                self.dx = self.canvas.width / data.length;
                for(var i=0;i<data.length;i++) {
                    self.gains[i] = self.audio.createGain();
                    self.gains[i].connect(self.out);
                    self.gains[i].gain.value = data[i].gain;

                    self.knobs[i] = {
                        x: i * self.dx + 15,
                        y: self.baseline,
                        val: 1,
                        name: data[i].name,
                        radius: 10
                    };

                    self.loadBuffer(i, data[i].file);
                }
            });

        }
    });

    return Drumkit;
});
