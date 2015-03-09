<!DOCTYPE html>
<html>
	<head>
		<title>DAW</title>
		<meta charset="UTF-8">
		<link rel="stylesheet"
			href="scripts/lib/bootstrap/dist/css/bootstrap.css">
		<link rel="stylesheet" href="css/daw.css">
		<script data-main="scripts/main" src="scripts/lib/requirejs/require.js"></script>
	</head>
	<body>
		<div class="container">
			<h1>Digital Audio Workstation</h1>
			<div class="row">
				<div class="col-sm-6">
					<div id="narrow"></div>
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
								<i class="glyphicon glyphicon-cloud-upload"></i>
							</button>
							<p id="message">Click circle to record 5 sec. sound</p>
						</div>
					</form>
					<div id="wide"></div>
					<p>
						<small>
							© 2015 Powered by
							<a href="http://github.com/ruslanas/daw"
							target="_blank">daw</a>
						</small>
					</p>
				</div>
				<div class="col-sm-6">
					<div id="tracks" class="text-left"></div>
				</div>
			</div>
		</div>
	</body>
</html>
