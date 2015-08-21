
'use strict';
var Product = require('../../models/productModel');

module.exports = function (router) {

	//lijst binnehalen
	router.get('/', function (req, res) {

		Product.find(function (err, prods) {
			if (err) {
				console.log(err);
			}
			prods.forEach(function(prod) {
				prod.prettyPrice = prod.prettyPrice();
			});
			var model =
			{
				products: prods
			};
			res.render('products', model);
		});

	});

/* Afbeelding opstaal */
router.post('/upload', function (req, res) {
    var tempPath = req.files.file.path,
        targetPath = path.resolve('./uploads/image.png');
    if (path.extname(req.files.file.name).toLowerCase() === '.png') {
        fs.rename(tempPath, targetPath, function(err) {
            if (err) throw err;
            console.log("Upload completed!");
        });
    } else {
        fs.unlink(tempPath, function () {
            if (err) throw err;
            console.error("Only PNG");
        });
    }
    // ...
});
	/* 
		Database opslaan
	 */
	router.post('/', function (req, res) {
		var title = req.body.title && req.body.title.trim();
		var description = req.body.description && req.body.description.trim();
		var image = req.body.image && req.body.image.trim();
		/*
		deze Code wordt normaal streng afgeraden te gebruiken, maar de tutorial die ik volgde melde 
		erbij dat toen deze werdt geschreven de betere oplossing nog niet echt op punt stond, 
		Daarom werdt deze toch toegepast om zo veel mogelijk mensen te kunnen helpen
		De code werkt, maar is niet veilig in productie
		 */
		var price = parseFloat(req.body.price, 10);

		//input checking
		if (title === '' || isNaN(price)) {
			res.redirect('/products#BadInput');
			return;
		}

		var newProduct = new Product({title: title, description: description, price: price, image: image});

		//in console tonen voor handigheid
		newProduct.whatAmI();
		/* The call back recieves to more arguments ->product/s that is/are added to the database
		 and number of rows that are affected because of save, which right now are ignored
		 only errors object is consumed*/
		newProduct.save(function(err) {
			if(err) {
				console.log('save error', err);
			}

			res.redirect('/products');
		});
	});

};
