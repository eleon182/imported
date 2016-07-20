var req = require('./imported').init('subDirectoryA');

var myfileC = req.myFileC;
var myfileA = req.myFileA;
var myfileB= req.myFileB;

myfileB();
