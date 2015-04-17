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
            this.updated = false;
        },

        onMouseDown: function(event) {
            var idx = Math.floor(this.getX(event) / 25);
            this.y = this.getY(event);
            this.down = this.gains[idx];
            this.setStatus(this.knobs[idx].name);
            this.updated = true;
        },

        onMouseUp: function(event) {
            this.down = false;
            this.setStatus('');
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
            });
        },

        initialize: function() {
            this._super();
            var self = this;
            this.rack.load('api/drumkits/1', function(data) {
                self.knobs = new Array(data.length);
                self.gains = new Array(data.length);

                for(var i=0;i<data.length;i++) {
                    self.loadBuffer(i, data[i]);
                }
            });

        }
    });

    return Drumkit;
});
