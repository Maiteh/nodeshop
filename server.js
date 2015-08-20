'use strict';


var kraken = require('kraken-js'),
    app = require('express')(),
    options = require('./lib/spec')(),
    port = process.env.PORT || 8000;
	path = require('path'),
    fs = require('fs');

app.use(express.bodyParser({uploadDir:'/public/img/temp'}));

app.use(kraken(options));

app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});
