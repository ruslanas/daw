require.config({
	baseUrl: "scripts",
	paths: {
		"jquery": ["lib/jquery/dist/jquery"]
	}
});
require(['daw'], function(DAW) {
	DAW.initialize();
});