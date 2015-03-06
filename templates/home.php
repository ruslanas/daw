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
			<h1>Say something 8bit</h1>
			<div>
				<canvas id="visualiser" width="215" height="100"></canvas>
				<canvas id="analyzer" width="215" height="100"></canvas>
			</div>
			<div>
				<canvas id="editor" width="435" height="100"></canvas>
			</div>
			<form class="form-inline">
				<div class="form-group">
					<div class="btn-group">
						<button id="record-btn" class="btn btn-danger btn-sm">
							<i class="glyphicon glyphicon-record"></i>
						</button>
						<button id="pause-btn" disabled="disabled" class="btn btn-success btn-sm">
							<i class="glyphicon glyphicon-stop"></i>
						</button>
						<button id="play-btn" disabled="disabled" class="btn btn-success btn-sm">
							<i class="glyphicon glyphicon-play"></i>
						</button>
					</div>
					<button class="btn btn-sm btn-primary" id="save-btn">
						<i class="glyphicon glyphicon-hdd"></i>
					</button>
					<div id="message">Hit red button.</div>
				</div>
			</form>
			<div id="list"></div>
		</div>
	</body>
</html>
