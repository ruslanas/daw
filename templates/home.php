<!DOCTYPE html>
<html>
    <head>
        <title>DAW</title>
        <meta charset="UTF-8">

        <link rel="stylesheet"
              href="scripts/lib/bootstrap/dist/css/bootstrap.css">
        <link rel="stylesheet"
              href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="css/daw.css">

        <!--
        Polyfills
        https://hacks.mozilla.org/2014/12/mozilla-and-web-components/
        -->
        <!-- FF about:config dom.webcomponents.enabled=true-->
        <!--
        <script src="scripts/lib/webcomponentsjs/CustomElements.js"></script>
        <script src="scripts/lib/webcomponentsjs/ShadowDOM.js"></script>
        -->
        <script src="scripts/lib/webcomponentsjs/CustomElements.js"></script>
        <script src="scripts/lib/webcomponentsjs/HTMLImports.js"></script>
        <link rel="import" href="components/playlist.html">

        <script data-main="scripts/main"
                src="scripts/lib/requirejs/require.js"></script>
    </head>
    <body>
        <div class="container">
            <h1>Digital Audio Workstation
                <sup><small>Beta 0.2.0</small></sup></h1>
            <div class="row">
                <div class="col-sm-6">
                    <div id="narrow"></div>
                    <form class="form-inline">
                        <div class="form-group">
                            <div class="btn-group">
                                <button id="record-btn"
                                        title="Record a sound"
                                        class="btn btn-primary">
                                    <i class="fa fa-circle"></i>
                                </button>
                                <button class="btn btn-primary"
                                        title="Turn microphone on/off"
                                        id="mic-btn">
                                    <i class="fa fa-microphone"></i>
                                </button>
                                <button id="pause-btn"
                                        disabled="disabled"
                                        title="Pause playback"
                                        class="btn btn-success">
                                    <i class="glyphicon glyphicon-stop"></i>
                                </button>
                                <button id="play-btn"
                                        disabled="disabled"
                                        title="Play recorded sound"
                                        class="btn btn-success">
                                    <i class="glyphicon glyphicon-play"></i>
                                </button>
                                <button class="btn btn-primary"
                                        title="Upload to server"
                                        disabled="disabled"
                                        id="save-btn">
                                    <i class="glyphicon glyphicon-cloud-upload"></i>
                                </button>
                                </button>
                                <button class="btn btn-primary"
                                        title="Speakers on/off"
                                        id="volume-btn">
                                    <i class="glyphicon glyphicon-volume-up"></i>
                                </button>
                            </div>
                            <p id="message">Click the circle to record</p>
                        </div>
                    </form>
                    <div id="wide"></div>
                    <p>
                        At the moment only latest
                        <a href="http://www.google.com/chrome/">Chrome</a> browsers support all the features.
                    </p>
                    <p>
                        <small>
                            © 2015 Powered by
                            <a href="http://github.com/ruslanas/daw"
                            target="_blank">daw</a>.
                            Report <a href="https://github.com/ruslanas/daw/issues">issues</a>.
                        </small>
                    </p>
                </div>
                <div class="col-sm-6">
                    <div id="save-form">
                        <form>
                            <div class="form-group">
                                <label>Song name:</label>
                                <input type="text"
                                       name="name"
                                       autocomplete="off"
                                       spellcheck="false"
                                       class="form-control"/>
                            </div>
                            <div class="form-group">
                                <label>Your email:</label>
                                <input type="email"
                                       name="email"
                                       autocomplete="off"
                                       spellcheck="false"
                                       class="form-control"/>
                            </div>
                            <button class="btn btn-default">Save</button>
                        </form>
                    </div>
                    <daw-playlist src="api/songs"></daw-playlist>
                </div>
            </div>
        </div>
    </body>
</html>
