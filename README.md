# imported
Node.JS global require

# Summary
This module will help clean your module dependencies by eliminating the need to require every single module in your project using relative paths.

With 'imported', you simply initialize it with a project directory name, and imported will scan your project and load every module for you. Then you simply have to request any module in your project by its name without any paths.

# Update
With version 2.x, I have removed fuzzy matching to simplify the algorithm. Now, you must ensure your project has no file name collisions.
This will make it easier for you to get any dependency in your project by using the file name only.

# Installation
```
npm install imported
```

# Usage
Assuming your directory structure looks as follows:

```
mainProjectDir
    |
    |
    -> start.js
    subDirectoryA
        |
        -> myfileA.js
        -> myfileB.js
        |
        |
        subDirectoryB
            |
            |
            -> myfileC.js
```

myfileC.js
```
module.exports = {
    run: run
};

function run(){
    console.log('Hi');
}
```

start.js
```
var req = require('imported').init('subDirectoryA');

var myfileC = req.get('myfileC');
var myfileA = req.get('myfileA');
var myfileB= req.myFileB; // Optional notation.

myfileC.run();
```

Output: 'Hi'

myFileB.js
```
var dep = require('imported');
var myFileC = dep.get('myFileC');

function runme() {
    var myFileA = dep.get('myFileA'); // import any module from any other module
    var myFileB = dep.myFileB; // import any module from any other module

    myFileC.run();
}
```
Output: 'Hi'

# API
### init *required*
Initialize module and process directory.

```
var req = require('imported').init('subDirectoryA');
var req = require('imported').init('subDirectoryA', {exclude: /(\.git|\.svn|node_modules|test)/ }); // Exclude option will not import those directories. Use Regex.
var req = require('imported').init(); // Optional parameter. Defaults to current directory.

```

Pass in an object instead to manually override dependencies. Used for mocking dependencies during unit testing.
```
var req = require('imported').init({
    myFileC: {
        run: function() {
            console.log('this is a mock function that overrides dependencies');
        }
    }
});
```

Optionally, you can also override only specific dependencies using the optional parameter: 'override'
```
// Will allow all normal dependencies except override the ones specified by the override parameter
var req = require('../imported').init('.', {
    override: {
        myFileC: {
            run: function() {
                console.log('run mock');
            }
        }
    }
});
```
Default exclusion directories:
```
/(\.git|\.svn|node_modules)/
```

### get
Primary method used to import a module
```
var req = require('imported');

var myfileC = req.myfileC;
var myfileA = req.get('myfileA'); // Optional get function instead.
```

# Features
- Require any module in your entire project using the file's name
- Will recusively search your project for the module you are requesting
- Throws an error when 'requiring' a dependency that does not exist
- Throws an error when a naming collision is detected
- Collision detection
- Unit testing coverage on all interfaces for helper functions
- Directory exclusion

# Future
- Easy dependency override for unit testing mocking
