var req = require('require-dir');
var debug = require('debug')('dev');
var lo = require('lodash');
var FS = require('fs');
var Path = require('path');
var walk = require('walk');

module.exports = {
    init: init,
    get: get,
    getInit: getInit
};

var init_dir = null;
var absolute_paths = [];
var absolute_dir = [];
var directory;

function getInit() {
    return init_dir;
}

function init(param) {
    if (param) {
        var parent = module.parent;
        var parentFile = parent.filename;
        var parentDir = Path.dirname(parentFile);
        directory = Path.resolve(parentDir, param);

        init_dir = req(directory, {
            recurse: true
        });
        debug('init done', directory);
        debug('structure: ', init_dir);

        initializeAbsolutePaths(init_dir);
    }
}

function get(name) {
    if (!name) {
        return init_dir;
    } else {
        return lo.get(init_dir, name) || lo.get(init_dir, matchExactly(name)) || lo.get(init_dir, matchFuzzy(name)) || get_recurse(init_dir, name);
    }
}

function matchExactly(name) {
    debug('exact start');
    var list = [];
    var dirList = [];
    var response;

    debug('abs dir', absolute_dir);

    absolute_dir.forEach(function(val) {
        if (isExactMatch(name, val)) {
            debug('exact dir found: ', val);
            dirList.push(val);
        }
    });

    absolute_paths.forEach(function(val) {
        if (isExactMatch(name, val)) {
            debug('exact file found: ', val);
            list.push(val);
        }
    });

    if (dirList.length >= 1) {
        response = lo.head(dirList);
    } else if (list.length === 1) {
        response = lo.head(list);
    } else if (list.length !== 0 && dirList !== 0) {
        debug('exact list collision: ', list);
        throw 'Namespace collision: ' + lo.toString(list) + '  ' + lo.toString(dirList);
    }

    return response;
}

function isExactMatch(name, path) {
    var pathSplit = lo.split(path, '.');
    var nameSplit = lo.split(name, '.');

    var first = lo.indexOf(pathSplit, lo.head(nameSplit));
    var last = lo.indexOf(pathSplit, lo.last(nameSplit));

    var subArray = lo.slice(pathSplit, first, last + 1);

    return lo.isEqual(subArray, nameSplit);
}

function matchFuzzy(name) {
    debug('fuzzy start');
    var list = [];
    var dirList = [];
    var response;

    debug('abs dir', absolute_dir);

    absolute_dir.forEach(function(val) {
        if (isFuzzyMatch(name, val)) {
            debug('fuzzy found: ', val);
            dirList.push(val);
        }
    });

    absolute_paths.forEach(function(val) {
        if (isFuzzyMatch(name, val)) {
            debug('exact found: ', val);
            list.push(val);
        }
    });

    if (dirList.length >= 1) {
        response = lo.head(dirList);
    } else if (list.length === 1) {
        response = lo.head(list);
    } else if (list.length !== 0 && dirList !== 0) {
        debug('fuzzy list collision: ', list);
        throw 'Namespace collision: ' + lo.toString(list) + '  ' + lo.toString(dirList);
    }

    return response;
}

function isFuzzyMatch(name, path) {
    var pathSplit = lo.split(path, '.');
    var nameSplit = lo.split(name, '.');

    var intersection = lo.intersection(pathSplit, nameSplit);

    return intersection.length === nameSplit.length;
}

function initializeAbsolutePaths(raw_paths) {
    var options = {
        listeners: {
            names: function(root, nodeNamesArray) {},
            directories: function(root, dirStatsArray, next) {
                lo.map(dirStatsArray, function(val) {
                    absolute_dir.push(root + '/' + val.name);
                });
                next();
            },
            file: function(root, fileStats, next) {
                absolute_paths.push(root + '/' + stripExtension(fileStats.name));
                next();
            },
        }
    };
    walk.walkSync(directory, options);

    absolute_paths = formatPaths(absolute_paths);
    absolute_dir = formatPaths(absolute_dir);
}

function stripExtension(fileName) {
    var split = lo.split(fileName, '.');
    split = lo.dropRight(split);

    return lo.join(split, '.');
}

function formatPaths(paths) {
    var output = [];
    var temp = [];

    //debug('format paths: ', paths);
    paths.forEach(function(val) {
        temp.push(lo.replace(val, directory + '/', ''));
    });

    temp.forEach(function(val) {
        output.push(lo.replace(val, /\//gi, '.'));
    });

    return output;
}

function get_recurse(param, obj) {
    if (lo.isObject(param)) {
        if (lo.has(param, obj)) {
            return lo.get(param, obj);
        } else {
            for (var key in param) {
                if (lo.isObject(param[key])) {
                    var temp = get_recurse(param[key], obj);
                    if (temp) {
                        debug('recurse found: ', temp);
                        return temp;
                    }
                }
            }
        }
    }
}

function buildError(message, error) {
    return message + ', error: ' + error;
}
