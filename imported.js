var req = require('require-dir');
var lo = require('lodash');
var FS = require('fs');
var Path = require('path');

module.exports = {
    init: init,
    get: get,
    getInit: getInit
};

var init_dir = null;

function getInit() {
    return init_dir;
}

function init(param) {
    var parent = module.parent;
    var parentFile = parent.filename;
    var parentDir = Path.dirname(parentFile);

    if (param) {
        try {
            var directory = Path.resolve(parentDir, param);
            init_dir = req(directory, {
                recurse: true
            });
        } catch (err) {
            console.log('Directory does not exist!');
        }
    }
}

function get(param) {
    var absolute = lo.get(init_dir, param);
    if (absolute) {
        return absolute;
    } else {
        return get_recurse(init_dir, param);
    }
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
