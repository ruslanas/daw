/**
 * Sampler plugin
 * @author Ruslanas Balciunas
 */

define('plugins/sampler', ['Gadget', 'jquery'], function(Gadget, $) {

    var Sampler = Gadget.extend({

        source: null,
        audio: null,

        init: function() {
            this._super();
            this.title = 'Current track';
            this.width(512);
            this.height(50);
        },

        loadTracks: function(data) {
            var container = $('#tracks').html('');
            for(var i=0;i<data.length;i++) {

                var div = $('<div/>');
                var a = $('<a href="#" class="btn">' +
                    '<i class="glyphicon glyphicon-play"></i>' + "\n" +
                    data[i] + '</a>');
                var audio = $('<audio><source src="uploads/' +
                    data[i]+'" type="audio/mpeg"></source></audio>');

                div.append(a);
                div.append(audio)
                container.append(div);

                var source = this.rack.context.createMediaElementSource(
                    audio[0]);

                source.connect(this.rack.visualiser);
            }

            // may be muted after recording session
            this.rack.masterGain.gain.value = 1;

        },

        initialize: function() {
            this.options.hidden = this.options.hidden || false;
            if(!this.options.hidden) {
                this._super();
            }
        }
    });

    return new Sampler();

});
