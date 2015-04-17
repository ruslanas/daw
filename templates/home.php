<!DOCTYPE html>
<html>
    <head>
        <title>Tonmeister</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="css/styles.css">

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
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                    <a class="navbar-brand" href="<?php echo $baseUrl;?>">Tonmeister
                        <sup><small>Beta 0.3.0</small></sup>
                    </a>
                </div>
            </div>
        </nav>
        <div class="container">
            <div class="row">
                <div class="col-sm-6">
                    <div id="narrow" class="row">
                        <div class="col-sm-6" id="buffer"></div>
                        <div class="col-sm-6" id="analyser"></div>
                    </div>
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
                    <div id="wide"></div>
                    <div class="row">
                        <div class="col-sm-6" id="keyboard"></div>
                        <div class="col-sm-6" id="effects"></div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="row">
                        <div class="col-sm-6" id="drums"></div>
                        <div class="col-sm-6" id="strings">
                            <daw-playlist src="api/songs"></daw-playlist>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nav class="navbar navbar-default navbar-fixed-bottom">
            <div class="container">
                <div class="row">
                    <div class="col-sm-6" id="mixer"></div>
                    <div class="col-sm-6" id="timeline"></div>
                </div>
                <div class="row">
                    <div class="col-sm-6" id="control-panel">
                        <input type="number" id="bpm" size="4"/>
                        <button class="btn btn-default btn-lg" id="main-play"><i class="fa fa-play"></i></button>
                    </div>
                    <div class="col-sm-6">
                        <p id="message"></p>
                        <small>
                            © 2015 Powered by
                            <a href="http://github.com/ruslanas/daw"
                            target="_blank">DAW</a>.
                            Report <a href="https://github.com/ruslanas/daw/issues">issues</a>.
                        </small>
                    </div>
                </div>
            </div>
        </nav>
    </body>
</html>
