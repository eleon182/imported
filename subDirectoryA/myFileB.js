var dep = require('../imported');
var myFileC = null;

module.exports = runme;

function runme() {
    myFileC = dep.myFileC; // import any module from any other module
    myFileC.run();
}
