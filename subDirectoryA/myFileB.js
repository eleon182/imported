var dep = require('../imported');

module.exports = runme;

function runme() {
    myFileC = dep.myFileC; // use any module from any other module
    myFileC.run();
}
