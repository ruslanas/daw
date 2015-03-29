/**
 * Sampler plugin
 * @author Ruslanas Balciunas
 */

define('plugins/sampler', [
    'Gadget',
    'jquery'
    ], function(Gadget, $) {

    var Sampler = Gadget.extend({

        source: null,
        audio: null,

        init: function() {
            this._super();
            this.title = 'Current track';
            this.width(512);
            this.height(50);
        },

        loadTracks: function(data, done) {
            done = done || function(data) {
                // void
            };

            this.parent.clear();

            for(var i=0;i<data.length;i++) {

                var audio = this.parent.addTrack(data[i]);

                var source = this.rack.context.createMediaElementSource(
                    audio);

                source.connect(this.rack.visualiser);
            }

            // may be muted after recording session
            this.rack.setVolume(1);
            done(data);
        },

        initialize: function() {
            this.options.hidden = this.options.hidden || false;
            if(!this.options.hidden) {
                this._super();
            }
        }
    });

    return Sampler;

});
