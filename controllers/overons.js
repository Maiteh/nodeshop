'use strict';

var OveronsModel = require('../models/overons');


module.exports = function (router) {

    var model = new OveronsModel();

    router.get('/', function (req, res) {
        
        
        res.render('overons', model);
        
        
    });

};
