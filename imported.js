var req = require('require-dir');
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
    var response;
    var count = 0;

    absolute_paths.forEach(function(val) {
        if (val.indexOf(name) >= 0) {
            response = val;
            count++;
        }
    });

    if (count === 1) {
        return response;
    } else if (count > 1) {
        throw buildError('Namespace collision!', name);
    }

    return response;
}

function matchFuzzy(name) {
    var response;
    var count = 0;

    absolute_paths.forEach(function(val) {
        if (isFuzzyMatch(name, val)) {
            count++;
            response = val;
        }
    });

    if (count > 1) {
        throw buildError('Namespace collision!', name);
    }

    return response;
}

function isFuzzyMatch(name, path) {
    var split = lo.split(name, '.');
    var response = true;
    split.forEach(function(val) {
        if (path.indexOf(val) < 0) {
            response = false;
        }
    });
    return response;
}

function initializeAbsolutePaths(raw_paths) {
    var options = {
        listeners: {
            names: function(root, nodeNamesArray) {},
            directories: function(root, dirStatsArray, next) {
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
}

function stripExtension(fileName) {
    var split = lo.split(fileName, '.');
    split = lo.dropRight(split);

    return lo.join(split, '.');
}

function formatPaths(paths) {
    var output = [];
    var temp = [];

    paths.forEach(function(val) {
        temp.push(lo.replace(val, directory + '/', ''));
    });

    temp.forEach(function(val) {
        output.push(lo.replace(val, /\//gi, '.'));
    });

    return output;
}

function get_recurse(param, obj) {
    if (param && lo.isObject(param) && lo.has(param, obj)) {
        return lo.get(param, obj);
    } else {
        if (lo.isObject(param)) {
            for (var key in param) {
                if (lo.isObject(param[key])) {
                    var temp = get_recurse(param[key], obj);
                    if (temp) {
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
