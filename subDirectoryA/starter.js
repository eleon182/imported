var req = require('../imported').init();

var myfileC = req.myFileC;
var myfileA = req.myFileA;
var myfileB= req.myFileB;

console.log(req);
myfileB();
