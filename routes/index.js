
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'Express' });
};

exports.about = function(req, res){
	res.redirect('/#about');
};

exports.projects = function(req, res){
	res.redirect('/#projects');
};