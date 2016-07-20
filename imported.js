var req = require('require-dir');
var path = require('path');
var lo = require('lodash');
var helper = require('./helper');

var imported_interface = {
    init: init,
    get: get
};

module.exports = imported_interface;

function init(param) {
    if (!param) param = '.';

    var dir_list = helper.constructDirectoryList(helper.getDirectoryList(param));

    var parent = module.parent;
    var parentFile = parent.filename;
    var parentDir = path.dirname(parentFile);
    directory = path.resolve(parentDir, param);

    var req_list = req(directory, {
        recurse: true
    });

    helper.loadObjects(imported_interface, req_list, dir_list);
    return imported_interface;
}

function get(param) {
    if (imported_interface[param]) {
        return imported_interface[param];
    } else {
        throw 'Dependency not found: ' + param;
    }
}

