
'use strict';

//var db = require('../lib/db');

module.exports = function (app) {

	app.get('/', function (req, res) {
		res.render('/admin');
	});

	app.get('/products', function (req, res) {
		db.Products.toArray(function (products){
			res.render('admin/products', {products: products});
		});
		
	});
};