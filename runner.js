var req = require('./imported');

req.init('subDirectoryA');

var myfileC = req.get('myFileC');
var myfileA = req.get('myFileA');
var myfileB= req.get('myFileB');

myfileB();
