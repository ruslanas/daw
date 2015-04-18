/**
 * Mixer
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/mixer', [
    'Gadget',
    'jquery'
    ], function(Gadget, $) {

    var Mixer = Gadget.extend({

        sliders: null,
        padding: 20,
        channels: null,
        down: false,
        defaultLevel: 0,

        init: function() {
            this._super();
            this.defaultLevel = 0.8;
            this.oldLevel = this.defaultLevel;
            this.sliders = [this.defaultLevel];
            this.channels = [];
            this.height(150);
            this.title = 'Mixer';
        },

        drawSlider: function(title, i, val) {

            var width = this.width() / this.sliders.length;

            var x = i * width + width / 2;
            this.context.strokeRect(x - 3, this.padding, 6, this.sliderHeight);

            var y = this.height() - this.padding - val * this.sliderHeight;

            this.context.beginPath();
            this.context.moveTo(x + 3, y);
            this.context.lineTo(x + 10, y - 5);
            this.context.lineTo(x + 10, y + 5);
            this.context.fill();

            this.context.fillRect(x - 3, y, 6, this.height() - y - this.padding);

            this.context.fillText(title, x, this.height() - 5);

        },

        redraw: function() {

            this.clear();

            var width = this.width() / this.sliders.length;
            var x = width / 2;
            var bottom = this.height() - this.padding;
            var labelY = this.height() - 5;

            // master fader
            this.drawSlider('Master', 0, this.sliders[0]);
            this.vline(width);

            for(var i=1;i<this.sliders.length;i++) {

                x += width;
                var y = bottom - this.sliders[i] * this.sliderHeight;

                this.context.strokeRect(x - 3, this.padding, 6, this.sliderHeight);

                this.context.beginPath();
                this.context.moveTo(x + 3, y);
                this.context.lineTo(x + 10, y - 5);
                this.context.lineTo(x + 10, y + 5);
                this.context.fill();

                this.context.fillRect(x - 3, y, 6, bottom - y);

                var title = this.channels[i - 1].title;
                this.context.fillText(title, x, labelY);
            }

            this.updated = false;
        },

        updateSlider: function(x, y) {
            var height = this.canvas.height - 2 * this.padding;

            var idx = Math.floor(
                x / (this.canvas.width / this.sliders.length));

            var val = (height + this.padding - y) / height;

            val = Math.max(0, Math.min(1, val));
            this.sliders[idx] = val;

            if(idx > 0) {
                this.channels[idx - 1].input.gain.value = val;
            } else {
                this.rack.setVolume(this.sliders[0]);
            }

            this.updated = true;
        },

        onMouseUp: function(event) {
            this.down = false;
        },

        onMouseDown: function(event) {
            var $canvas = $(this.canvas);
            this.updateSlider(this.getX(event), this.getY(event));
            this.down = true;
        },

        onMouseMove: function(event) {
            if(this.down) {
                this.updateSlider(this.getX(event), this.getY(event));
            }
        },

        connect: function(gadget) {

            if(!gadget.out) {
                throw 'No out node';
            }

            var fader = this.audio.createGain();

            this.sliders.push(this.defaultLevel);
            this.channels.push({
                input: fader,
                title: gadget.title
            });

            fader.gain.value = this.defaultLevel;
            fader.connect(this.rack.masterGain);

            gadget.out.connect(fader);
            this.updated = true;
        },

        initialize: function() {

            this._super();

            this.sliderHeight = this.height() - this.padding * 2;

            // all labels are centered, it will not change
            this.context.textAlign = 'center';

            var self = this;

            this.rack.addButton('glyphicon glyphicon-volume-up', function(on, button) {

                var icon = button.querySelector('i');

                if(on) {
                    icon.className = 'glyphicon glyphicon-volume-up';
                } else {
                    icon.className = 'glyphicon glyphicon-volume-off';
                }

                if(self.sliders[0] > 0) {
                    self.oldLevel = self.sliders[0];
                    self.sliders[0] = 0;
                } else {
                    self.sliders[0] = self.oldLevel;
                }

                self.rack.setVolume(self.sliders[0]);
                self.updated = true;
            });
        }
    });

    return Mixer;
});
