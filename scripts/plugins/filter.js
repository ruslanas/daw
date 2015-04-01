/**
 * Filter
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/filter', ['Gadget'], function(Gadget) {

    var Filter = Gadget.extend({

        input: null,
        out: null,
        type: 'lowshelf',
        down: false,

        init: function() {
            this._super();
            this.title = 'Filter';
        },

        redraw: function() {
            this.clear();
            this.context.fillStyle = '#FF0';
            this.context.fillRect(this.x - 2, this.y - 2, 4, 4);
            this.context.fillStyle = '#00F';
            this.context.fillRect(this.x - 2, this.height() / 2, 4, 4);
            this.context.fillStyle = this.color;
            var status = this.out.gain.value + ' ' + Math.round(this.out.frequency.value) + 'Hz';
            this.context.fillText(status, 2, this.canvas.height - 2);

            for(var i=0;i<this.magResponse.length;i++) {
                var x = this.width() * this.frequencyArray[i]/this.nyquist;
                var dbResponse = 20.0 * Math.log(this.magResponse[i]) / Math.LN10;
                this.context.fillRect(x, dbResponse + this.height() / 2, 1, 1);
            }
            this.updated = false;
        },

        connect: function(gadget) {
            if(!gadget.out) {
                throw 'No out node';
            }
            gadget.out.connect(this.input);
        },

        onChange: function(event) {

            this.x = this.getX(event);
            this.y = this.getY(event);

            this.reset();
            this.updated = true;
        },

        onMouseDown: function(event) {
            this.down = true;
            this.onChange(event);
        },

        onMouseUp: function(event) {
            this.down = false;
            this.onChange(event);
        },

        onMouseMove: function(event) {
            if(!this.down) {
                return;
            }
            this.onChange(event);
        },

        reset: function() {
            this.out.frequency.value = (this.audio.sampleRate / 2) * this.x / this.canvas.width;
            // [-40; 40] dB
            this.out.gain.value = 80 * this.y / this.canvas.height - 40;
            this.out.getFrequencyResponse(this.frequencyArray, this.magResponse, this.phaseResponse);
        },

        initialize: function() {
            this._super();
            var filter = this.audio.createBiquadFilter();

            filter.type = this.type;
            filter.frequency.value = 1000;
            filter.Q.value = 1;
            filter.gain.value = 0;

            this.input = filter;
            this.out = filter;

            var width = this.width();

            this.frequencyArray = new Float32Array(width);

            for(var i=0;i<width;i++) {
                this.frequencyArray[i] = i * (this.audio.sampleRate / 2) / width;
            }

            this.magResponse = new Float32Array(width);
            this.phaseResponse = new Float32Array(width);
            // nyquist frequency
            this.nyquist = this.audio.sampleRate / 2;

        }
    });

    return Filter;
});