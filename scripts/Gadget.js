/*
Gadget is connected to GUI canvas. It is responsible
for redrawing it's control surface.
*/
define('Gadget', ['Class'], function() {

	// Gadget class
	var Gadget = Class.extend({
		init: function() {
			this.title = 'Gadget';
		},
		initialize: function() {
			this.context.fillStyle = '#007';
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.context.fillStyle = '#FFF';
			this.context.fillText(this.title, 5, 10);
			this.context.fillStyle = '#FF0';
			this.context.strokeStyle = '#FF0';
		},
		clear: function() {
			this.context.clearRect(0, 14, this.canvas.width, 86);
		},
		connect: function(selector, rack) {
			this.rack = rack;
			this.canvas = document.querySelector(selector);
			this.context = this.canvas.getContext('2d');
			this.initialize();
		}
	});

	return Gadget;
});
