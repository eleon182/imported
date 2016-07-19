var imported = require('../imported');
var myFileC = null;

module.exports = runme;

function runme() {
    myFileC = imported.get('myFileC'); // import any module from any other module
    myFileC.run();
}
