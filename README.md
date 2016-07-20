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

var myfileC = req.myfileC;
var myfileA = req.myfileA;
var myfileB= req.myFileB;

myfileC.run();
```

Output: 'Hi'

myFileB.js
```
var dep = require('imported');

function runme() {
    var myFileC = dep.myFileC; // import any module from any other module

    myFileC.run();
}
```
Output: 'Hi'

# API
### init *required*
Initialize module and process directory.

```
var req = require('imported').init('subDirectoryA');
```

### get
Primary method used to import a module

```
var req = require('imported');
var myfileC = req.myfileC;
var myfileA = req.get('myfileA'); // Optional get function instead
```

# Features
- Require any module in your entire project using the file's name
- Will recusively search your project for the module you are requesting
- Throws an error when 'requiring' a dependency that does not exist
- Throws an error when a naming collision is detected
- Collision detection
- Unit testing coverage on all interfaces for helper functions

# Notes
- Make sure you are not using the get function on a module during loading. Use the get function on demand when you need the dependency.
- Make sure the first thing you do is run the 'init' function. This will load all the modules into the imported library

# Future
- Easy dependency override for unit testing mocking
