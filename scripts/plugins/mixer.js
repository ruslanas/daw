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

        init: function() {
            this._super();
            this.sliders = [0.2];
            this.channels = [];
            this.height(150);
            this.title = 'Mixer';
        },

        redraw: function() {
            this.clear();

            var width = this.canvas.width / this.sliders.length;

            for(var i=0;i<this.sliders.length;i++) {
                var x = i * width + width / 2;
                this.context.strokeRect(
                    x - 3,
                    this.padding,
                    6,
                    this.canvas.height - this.padding * 2);

                var height = this.canvas.height - 2 * this.padding;

                var y = this.canvas.height - this.padding - this.sliders[i] * height;

                this.context.beginPath();
                this.context.moveTo(x + 3, y);
                this.context.lineTo(x + 10, y - 5);
                this.context.lineTo(x + 10, y + 5);
                this.context.fill();

                this.context.fillRect(x - 3, y, 6, this.height() - y - this.padding);

                this.context.textAlign = 'center';
                if(i === 0) {
                    var title = "Master";
                } else {
                    var title = this.channels[i - 1].title;
                }
                this.context.fillText(title, x, this.canvas.height - 5);
            }
        },

        update: function() {
            this.rack.setVolume(this.sliders[0]);
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
            }

        },

        onMouseUp: function(event) {
            this.down = false;
        },

        onMouseDown: function(event) {
            var $canvas = $(this.canvas);
            var x = event.clientX - $canvas.offset().left;
            var y = event.clientY - $canvas.offset().top + $('body').scrollTop();
            this.updateSlider(x, y);
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

            var fader = this.rack.context.createGain();
            this.sliders.push(0.6);
            this.channels.push({
                input: fader,
                title: gadget.title
            });
            fader.gain.value = 0.5;
            fader.connect(this.rack.masterGain);

            gadget.out.connect(fader);
        },

        initialize: function() {

            this._super();

            var self = this;
            this.addButton('glyphicon glyphicon-volume-up', function(on) {
                if(self.sliders[0] > 0) {
                    self.sliders[0] = 0;
                } else {
                    self.sliders[0] = 0.3;
                }
            }, {
                type: 'checkbox',
                checked: 'glyphicon glyphicon-volume-off'
            });
        }
    });

    return Mixer;
});
