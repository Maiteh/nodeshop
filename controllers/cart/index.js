'use strict';
var Product = require('../../models/productModel');
var getBundle = require('../../lib/getBundle');

module.exports = function (router) {

	/*
	  winkelmandje tonen
	 */
	router.get('/', getBundle, function (req, res) {

		//uit sessie halen
		var cart = req.session.cart,
			displayCart = { items:[], total: 0 },
			total = 0;
		var locals = res.locals;
		var i18n = res.app.kraken.get('i18n');
		var locality = locals && locals.context && locals.context.locality || i18n.fallback;
		var cartLength;

		if (!cart) 
		{
			res.bundle.get({'bundle': 'messages' , 'model': {}, 'locality': locality}, function bundleReturn(err, messages) 
			{
				res.render('result', {result: messages.empty, continueMessage: messages.keepShopping});
			});

			return;
		}

		//Hier worden de producten getoont
		for (var item in cart) {
			displayCart.items.push(cart[item]);
			total += (cart[item].qty * cart[item].price);
		}
		req.session.total = displayCart.total = total.toFixed(2);
		cartLength = Object.keys(cart).length;
		var model =
		{
			cart: displayCart
		};
		res.bundle.get({'bundle': 'messages', 'model': {'cartItemLength': cartLength}, 'locality': locality}, function bundleReturn(err, messages) 
		{
			model.itemsInCart = messages.items;
			res.render('cart', model);
		});
	});

	/*
	Toevoegen aan t winkelmandje
	 */
	router.post('/', function (req, res) {

		//Laden of herlade
		req.session.cart = req.session.cart || {};
		var cart = req.session.cart;

		//inkomende data leze
		var id = req.param('item_id');

		//toegevoegd product vinde 
		Product.findById(id, function (err, prod) {
			if (err) 
			{
				console.log('Error adding product to cart: ', err);
				res.redirect('/cart');
				return;
			}

			//Product bij tellen in winkelmandje 
			if (cart[id]) 
			{
				cart[id].qty++;
			}
			else 
			{
				cart[id] = 
				{
					title: prod.title,
					price: prod.price,
					prettyPrice: prod.prettyPrice(),
					qty: req.body.qty && req.body.qty
				};
			}

			res.redirect('/cart');

		});
	});
};
