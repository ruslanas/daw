/**
 * Score
 * Modular Audio Application Framework Core Plugin <http://daw.wri.lt>
 * @author Ruslanas Balciunas
 */

"use strict";

define('plugins/score', [
    'Gadget',
    'jquery'
    ], function(Gadget, $) {

    // SPN <http://en.wikipedia.org/wiki/Scientific_pitch_notation>

    var Pitch = {};
    var letters = "CDEFGAB";
    for(var i=0;i<21;i++) {
        var pitch = letters[i % letters.length] + (Math.floor(i/7) + 4);
        Pitch[pitch] = i;
    }

    var Symbols = {
        'G-clef': {
            file: 'svg/G-clef.svg',
            dy: -10
        },
        'half': {
            file: 'svg/Figure_rythmique_blanche_hampe_haut.svg',
            dy: 0
        },
        'whole': {
            file: 'svg/whole.svg',
            dy: 30
        },
        'quarter': {
            file: 'svg/crotchet.svg',
            dy: 0
        },
        'eighth': {
            file: 'svg/eighth_note_stem_up.svg',
            dy: 0
        },
        '16th': {
            file: 'svg/Figure_rythmique_double_croche_hampe_haut.svg',
            dy: 3
        },
        'rest-eighth': {
            file: 'svg/Crotchet_rest_plain-svg.svg',
            dy: 3
        },
        'rest-quarter': {
            file: 'svg/Crotchet_rest_plain-svg.svg',
            dy: 3
        },
        'rest-16th': {
            file: 'svg/16th_rest.svg',
            dy: -8
        }
    };

    var Score = Gadget.extend({

        help: "Score editor",
        partName: "",
        margin: 10,
        lineSpacing: 11,
        noteSpacing: 30,
        symbols: [],

        init: function() {

            this._super();

            this.height(150);
            this.title = 'Score';
        },

        loadSheet: function() {

            var self = this;

            this.rack.loadXml('api/scores/1', function(xmlDoc) {

                var $xml = $(xmlDoc);
                var $part = $xml.find('part-list score-part:first-child');
                self.partName = $part.find('part-name').text();

                var $measures = $xml.find('measure');

                // self.drawNote(2, 'whole', Pitch.C4); // calibrate
                // self.drawNote(2, 'whole', Pitch.E4); // calibrate

                self.drawNote(1, 'G-clef', Pitch.G4);

                $measures.each(function() {

                    var pos = 1;
                    $(this).find('note').each(function() {
                        pos++;
                        var type = $(this).find('type').text();

                        if($(this).find('rest').length) {
                            self.drawNote(pos, 'rest-'+type, 0);
                            return;
                        }

                        var $pitch = $(this).find('pitch');
                        var pitch = $pitch.find('step').text() + $(this).find('octave').text();
                        self.drawNote(pos, type, Pitch[pitch]);
                    });

                    self.bottom += this.lineSpacing * 6;

                });

            });
        },

        update: function() {
            this.updated = true;
        },

        drawNote: function(pos, note, pitch) {

            var self = this;

            if(Symbols[note] === undefined) {
                return;
            }
            var y = self.bottom - pitch * this.lineSpacing / 2 + Symbols[note].dy;
            if(this.symbols[note] !== undefined) {
                console.log('Cached');
                this.layerContext.drawImage(
                    this.symbols[note], pos * this.noteSpacing, y);
                this.updated = true;
                return;
            }

            var symbol = new Image();
            symbol.onload = function() {
                self.symbols[note] = symbol;
                self.layerContext.drawImage(
                    self.symbols[note], pos * self.noteSpacing, y);
                self.updated = true;
            };

            symbol.src = Symbols[note].file;
        },

        drawStaff: function(pos) {
        },

        redraw: function() {
            this.clear();

            var self = this;
            var y = this.margin + this.lineSpacing * 2;


            for(var k=0;k<3;k++) {
                for(var i=0;i<5;i++) {
                    this.context.fillRect(this.margin, y, this.width() - 2 * this.margin, 1);
                    y += this.lineSpacing;
                }
                y += 4 * this.lineSpacing;
            }

            this.context.fillRect(this.margin, top, 3, this.lineSpacing * 4 + 1);
            this.context.fillRect(this.width() - this.margin, top, 3, this.lineSpacing * 4 + 1);

            this.context.fillText(this.partName, 2, this.height() - 2);

            if(this.rack.started) {
                var elapsed = this.audio.currentTime - this.rack.started;
                var measures = elapsed * 10;
                this.vline(measures % this.width());
            }

            this.updated = false;
        },

        initialize: function() {
            this._super();
            var top = this.margin;
            this.bottom = top + 4 * this.lineSpacing;
            this.loadSheet();
            this.addLayer();
        }
    });

    return Score;
});
