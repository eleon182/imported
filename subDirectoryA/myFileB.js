var imp= require('../imported');
var myFileC = null;

module.exports = runme;

function runme() {
    myFileC = imp.get('myFileC'); // import any module from any other module
    myFileC.run();
}
