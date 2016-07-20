var lo = require('lodash');
var fs = require('fs');

module.exports = {
    loadObjects: loadObjects,
    getDirectoryList: getDirectoryList,
    constructDirectoryList: constructDirectoryList
};

function constructDirectoryList(list) {
    var mainList = extractScripts(list);
    var fileList = [];
    var currentFile;
    var dir_list = {};
    mainList.forEach(function(obj) {
        currentFile = getFileName(obj);
        fileList.push(currentFile);
        dir_list[currentFile] = extractObjectPath(obj);
    });
    validateFileList(fileList);
    return dir_list;
}

function loadObjects(object_list, req_list, dir_list){
    for(var key in dir_list){
        object_list[key] = lo.get(req_list, dir_list[key]);
    }
}

function initializeObjectList(dir_list, object_list){
    for(var key in dir_list){
        object_list[key] = {};
    }
}

function getDirectoryList(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) results = results.concat(getDirectoryList(file));
        else results.push(file);
    })
    return results;
}

function validateFileList(list) {
    var response = true;
    response = checkDuplicates(list);
    return response;
}

function checkDuplicates(list) {
    var dups = getDuplicates(list);
    if (dups.length > 0) {
        throw 'Dependency naming collision : ' + lo.join(dups, ', ');
        return false;
    } else {
        return true;
    }
}

function getDuplicates(array) {
    return lo.filter(array, function(value, index, iteratee) {
        return lo.includes(iteratee, value, index + 1);
    });
}

function extractObjectPath(file) {
    var response = file;
    if (response) {
        response = lo.split(response, '/');
        if (response.length > 1) {
            response = lo.drop(response);
        }
        response[response.length - 1] = stripExtension(response[response.length - 1]);
        response = lo.join(response, '.');
    }
    return response;
}

function getFileName(file) {
    var response = file;
    if (response) {
        response = lo.split(response, '/');
        response = response[response.length - 1];
        response = stripExtension(response);
    }
    return response;
}

function extractScripts(list) {
    var response = [];
    response = lo.filter(list, isValidFile);
    return response;
}

function isValidFile(file) {
    var extension = getExtension(file);
    return extension === 'js' || extension === 'json';
}

function getExtension(fileName) {
    if (!fileName) {
        return fileName;
    }
    var split = lo.split(fileName, '.');
    if (split.length > 1) {
        return split[split.length - 1];
    } else {
        return fileName;
    }
}

function stripExtension(fileName) {
    var split = lo.split(fileName, '.');
    if (split.length > 1) {
        split = lo.dropRight(split);
    }
    return lo.join(split, '.');
}
