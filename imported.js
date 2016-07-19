var req = require('require-dir');
var path = require('path');
var lo = require('lodash');
var helper = require('./helper');

var req_list = null;
var dir_list = null;

module.exports = {
    init: init,
    get: get
};

function init(param) {
    initializeDirectoryList(helper.getDirectoryList(param));
    var parent = module.parent;
    var parentFile = parent.filename;
    var parentDir = path.dirname(parentFile);
    directory = path.resolve(parentDir, param);

    req_list = req(directory, {
        recurse: true
    });
}

function get(param) {
    if (dir_list && dir_list[param]) {
        return lo.get(req_list, dir_list[param]);
    } else {
        throw 'Dependency not found: ' + param;
    }
}

function initializeDirectoryList(list) {
    var mainList = helper.extractScripts(list);
    var fileList = [];
    var currentFile;
    dir_list = {};
    mainList.forEach(function(obj) {
        currentFile = helper.getFileName(obj);
        fileList.push(currentFile);
        dir_list[currentFile] = helper.extractObjectPath(obj);
    });
    helper.validateFileList(fileList);
}
