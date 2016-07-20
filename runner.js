//var req = require('./imported').init('subDirectoryA');
var req = require('./imported').init('subDirectoryA', {exclude: /(\.git|\.svn|node_modules|test)/ });

var myfileC = req.myFileC;
var myfileA = req.myFileA;
var myfileB= req.myFileB;

myfileB();
