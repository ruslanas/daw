Digital Audio Workstation
=========================

About
-----

See [demo](http://daw.wri.lt/).

Installation
------------

Fork and/or clone repository in your servers public directory.

```git clone https://github.com/ruslanas/daw.git```

Install [Slim Framework](http://docs.slimframework.com/) and [bower](http://bower.io/) packages with [composer](https://getcomposer.org/).

```composer install```

Copy `config.sample.php` to `config.php` and edit as needed.

Plugins
-------

Plugins are JavaScript files stored in `scripts/plugins`. See
[examples](scripts/plugins).

```{js}

define('plugins/my_cool_plugin', ['Gadget'], function(Gadget) {
    var MyCoolPlugin = Gadget.extend({

        // constructor
        init: function() {
            this._super();
            this.title = 'My Cool Plugin';
        },

        redraw: function() {
            // do some cool stuff
            // draw to this.context
        },

        initialize: function() {
            this._super();
            // do some setup
        }
    });

    return MyCoolPlugin;
});

```

__Warning:__ interface may change anytime.

Notes
-----

You might want to [read this](http://superuser.com/questions/74116/windows-7-lowers-applications-volume-automatically).

Changelog
---------

Todo. Read [Semantic Versioning 2.0.0](http://semver.org/).

License
-------

[MIT License](LICENSE)
