const LITTLE_ENDIAN = true;

function Riff(view) {

	this.view = view;
	this.offset = 0;

	this.appendUTFBytes = function(string) {
		var lng = string.length;
		for (var i = 0; i < lng; i++){
			this.view.setUint8(this.offset + i, string.charCodeAt(i));
		}
		this.offset += lng;
	};
	this.appendUint32 = function(value) {
		this.view.setUint32(this.offset, value, LITTLE_ENDIAN);
		this.offset += 4;
	};
	this.appendUint16 = function(value) {
		this.view.setUint16(this.offset, value, LITTLE_ENDIAN);
		this.offset += 2;
	};
	this.appendUint8 = function(value) {
		this.view.setUint8(this.offset, value);
		this.offset += 1;
	};
}

define('riff', [], function() {
	return Riff;
});
