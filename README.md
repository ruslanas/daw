Digital Audio Workstation
=========================

About
=====

See [demo](http://daw.wri.lt/).

Installation
------------

Clone repository in your servers public directory.

```git clone https://github.com/ruslanas/daw.git```

Install [Slim Framework](http://docs.slimframework.com/) with
[composer](https://getcomposer.org/).

```composer install```

Install JavaScript libraries with [bower](http://bower.io/).

```bower install```

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

    return new MyCoolPlugin();
});

```

Notes
-----

You might want to [read this](http://superuser.com/questions/74116/windows-7-lowers-applications-volume-automatically).

Changelog
---------

Todo.

License
-------

[MIT License](LICENSE)
