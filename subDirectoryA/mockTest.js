var dep = require('../imported').init('.', {
    override: {
        myFileC: {
            run: function() {
                console.log('run mock');
            }
        }
    }
});

var myFileC = require('./myFileB.js');

myFileC();
