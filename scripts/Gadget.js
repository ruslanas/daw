/*
Gadget is connected to GUI canvas. It is responsible
for redrawing it's control surface.
*/

define('Gadget', ['Class'], function(Class) {

	// Gadget class
	var Gadget = Class.extend({
		init: function() {
			this.title = 'Gadget';
		},
		initialize: function() {
			this.context.fillText(this.title, 5, 10);
		},
		clear: function() {
			this.context.clearRect(0, 12, this.canvas.width, 88);
		},
		connect: function(selector, rack) {
			this.rack = rack;
			this.canvas = document.querySelector(selector);
			this.context = this.canvas.getContext('2d');
			this.context.fillStyle = '#FF0';
			this.context.strokeStyle = '#FF0';
			this.initialize();
		}
	});

	return Gadget;
});
