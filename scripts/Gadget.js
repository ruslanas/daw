/*
Gadget is connected to GUI canvas. It is responsible
for redrawing itself.
*/

define('Gadget', ['Class'], function(Class) {

	// Gadget class
	var Gadget = Class.extend({
		connect: function(selector, rack) {
			this.rack = rack;
			this.canvas = document.querySelector(selector);
			this.context = this.canvas.getContext('2d');
			this.context.fillStyle = '#FF0';
		}
	});

	return Gadget;
});
