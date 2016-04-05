# imported
Node.JS global require helper

# Summary
This module will help clean your module dependencies by eliminating the need to require every single module in your project using relative paths.

With 'imported', you simply give it a project directory name, and imported will scan your project and load every module for you. Then you simply have to request any module in your project by its name without any paths.

# Installation
```
npm install imported
```

# Usage
Assuming your directory structure looks as follows:

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
var req = require('imported');

req.init('subDirectoryA');

var myfileC = req.get('myfileC');

myfileC.run();
```

Output: 'Hi'

# Features
- Returns null when a module name is given that does not exist

# Future
- Namespacing
- Collision detection
