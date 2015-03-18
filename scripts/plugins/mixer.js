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

        init: function() {
            this._super();
            this.sliders = [0.5, 0.5, 0.5, 0.5];
            this.channels = new Array(3);
            this.height(150);
            this.title = 'Mixer';
        },

        redraw: function() {
            this.clear();

            var width = this.canvas.width / this.sliders.length;

            for(var i=0;i<this.sliders.length;i++) {
                var x = i * width + width / 2;
                this.context.strokeRect(
                    x - 2,
                    this.padding,
                    4,
                    this.canvas.height - this.padding * 2);

                var height = this.canvas.height - 2 * this.padding;
                this.context.fillRect(
                    x - 6,
                    this.canvas.height - this.padding - this.sliders[i] * height,
                    12, 2);

                this.context.textAlign = 'center';
                if(i === 0) {
                    var title = "Master";
                } else {
                    var title = this.channels[i - 1].title;
                }
                    this.context.fillText(
                        title, x, this.canvas.height - 5);
            }
        },

        update: function() {
            this.rack.setVolume(this.sliders[0]);
        },

        onMouseDown: function(event) {
            var $canvas = $(this.canvas);
            var x = event.clientX - $canvas.offset().left;
            var y = event.clientY - $canvas.offset().top + $('body').scrollTop();

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

        onMouseMove: function(event) {
            // void
        },

        connect: function(gadget, channel) {
            if(!gadget.out) {
                throw 'No out node';
            }
            this.channels[channel].title = gadget.title;
            gadget.out.connect(this.channels[channel].input);
        },

        initialize: function() {

            this._super();

            for(var i=0;i<this.channels.length;i++) {
                var fader = this.rack.context.createGain();
                this.channels[i] = {
                    input: fader,
                    title: "Not connected"
                };
                fader.gain.value = 0.5;
                fader.connect(this.rack.masterGain);
            }

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