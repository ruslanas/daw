<!DOCTYPE html>
<html>
	<head>
		<title>DAW</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
		<link rel="stylesheet" href="css/daw.css">
		<script data-main="scripts/main" src="scripts/lib/requirejs/require.js"></script>
	</head>
	<body>
		<div class="container text-center">
			<h1>Digital Audio Workstation</h1>
			<div id="narrow"></div>
			<div id="wide"></div>
			<div id="tracks"></div>
			<form class="form-inline">
				<div class="form-group">
					<div class="btn-group">
						<button id="record-btn"
								title="Record a sound"
								class="btn btn-danger btn-sm">
							<i class="glyphicon glyphicon-record"></i>
						</button>
						<button id="pause-btn"
								disabled="disabled"
								title="Pause playback"
								class="btn btn-success btn-sm">
							<i class="glyphicon glyphicon-stop"></i>
						</button>
						<button id="play-btn"
								disabled="disabled"
								title="Play recorded sound"
								class="btn btn-success btn-sm">
							<i class="glyphicon glyphicon-play"></i>
						</button>
					</div>
					<button class="btn btn-sm btn-primary"
							title="Upload to server"
							disabled="disabled"
							id="save-btn">
						<i class="glyphicon glyphicon-hdd"></i>
					</button>
					<div id="message">Click red button to start recording</div>
				</div>
			</form>
			<div id="list"></div>
		</div>
	</body>
</html>
