var dep = require('../imported');
var myFileC = dep.get('myFileC'); // use any module from any other module

module.exports = runme;

function runme() {
    //myFileC = dep.myFileC; // use any module from any other module
    myFileC.run();
}
