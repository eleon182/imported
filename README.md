# imported
Node.JS global require helper

# Summary
This module will help clean your module dependencies by eliminating the need to require every single module in your project using relative paths.

With 'imported', you simply initialize it with a project directory name, and imported will scan your project and load every module for you. Then you simply have to request any module in your project by its name without any paths.

If there is a naming conflict, you simply have to specify some of the path to resolve it. Just make sure to give it parts of the path that makes it unique enough, and imported will find it.

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
            -> myfileA.js
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
var req = require('imported');

req.init('subDirectoryA');

var myfileC = req.get('myfileC');
var myfileA = req.get('myfileA'); // throws error due to namespace collision
var myfileA = req.get('subDirectoryB.myfileA'); // OK
var myfileA = req.get('subDirectoryA.myfileA'); // OK

myfileC.run();
```

Output: 'Hi'

# API
### init *required
Initialize module and process directory.

```
var req = require('imported');
req.init('subDirectoryA');

```

### get
Primary method used to import a module

```
var myfileC = req.get('myfileC');
var myfileA = req.get('subDirectoryB.myfileA'); // OK
var myfileA = req.get('subDirectoryA.subDirectoryB.myfileA'); // OK
```

### getInit
Will return the entire module directory

```
var directoryStructure = req.getInit();
```

# Features
- Returns null when a module name is given that does not exist
- Namespacing (Absolulte and relative)
- Collision detection
- Allows lowest common denominator name spacing. You only have to specific enough of the name space to make the module you need unique.
- When using relative name spacing, imported will make its best attempt to find the correct module you need using as little information as possible from user.

# Future
- Submit requests!
