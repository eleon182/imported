var imported = require('../imported');
var myFileC = imported.get('myFileC'); // import any module from any other module

module.exports = runme;

function runme() {
    myFileC.run();
}
