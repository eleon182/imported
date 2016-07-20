var assert = require('assert');
var helper = require('../helper');

describe('processExcludes', function() {
    it('should return the excluded list', function() {
        var list = ['./.git/myFileA.js', './myFileA.js'];
        var exclude = /(\.git|\.svn|node_modules|test)/;
        var response = helper.processExcludes(list, exclude);
        assert.equal(response.length, 1);
    });

});

describe('manualRequire', function() {
    it('should return the proper require', function() {
        var dir_list = {
            myFileA: 'myFileA'
        }
        var path = './subDirectoryA';
        var input = 'myFileA';
        var response = helper.manualRequire(dir_list, input, path);
        assert(response);
    });

});
describe('extractScripts', function() {
    it('should remove html and css files', function() {
        var input = ['adir/a.js', 'g/b.json', 'bdir/ddir/c.html', 'g'];
        var response = helper.extractScripts(input);
        assert.equal(response.length, 2);
    });

    it('should not delete any files', function() {
        var input = ['a.js', 'b.json'];
        var response = helper.extractScripts(input);
        assert.equal(response.length, 2);
    });

    it('should return same array for empty array', function() {
        var input = [];
        var response = helper.extractScripts(input);
        assert.equal(response.length, 0);
    });
});

describe('getFileName', function() {
    it('should extract a', function() {
        var input = 'adir/a.js';
        var response = helper.getFileName(input);
        assert.equal(response, 'a');
    });

    it('should extract b when no directory', function() {
        var input = 'b.js';
        var response = helper.getFileName(input);
        assert.equal(response, 'b');

    });
    it('should extract b on deep directory', function() {
        var input = 'g/d/e/b.js';
        var response = helper.getFileName(input);
        assert.equal(response, 'b');
    });
    it('should not break when empty', function() {
        var input = '';
        var response = helper.getFileName(input);
        assert.equal(response, '');
    });
    it('should not break when null', function() {
        var input = null;
        var response = helper.getFileName(input);
        assert.equal(response, null);
    });
});

describe('extractObjectPath', function() {
    it('should get valid object path', function() {
        var input = 'adir/a.js';
        var response = helper.extractObjectPath(input);
        assert.equal(response, 'a');
    });

    it('should get valid object path for deep directory', function() {
        var input = 'adir/bdir/a.js';
        var response = helper.extractObjectPath(input);
        assert.equal(response, 'bdir.a');
    });
    it('should get valid object path when no directory', function() {
        var input = 'a.js';
        var response = helper.extractObjectPath(input);
        assert.equal(response, 'a');
    });
    it('should return the same when no extension', function() {
        var input = 'a';
        var response = helper.extractObjectPath(input);
        assert.equal(response, 'a');
    });

    it('should return the same when empty', function() {
        var input = '';
        var response = helper.extractObjectPath(input);
        assert.equal(response, '');
    });

    it('should return the same when null', function() {
        var input = null;
        var response = helper.extractObjectPath(input);
        assert.equal(response, null);
    });
});

describe('validateFileList', function() {
    it('should return true for valid list', function() {
        var input = ['a', 'b', 'c'];
        var response = helper.validateFileList(input);
        assert.equal(response, true);
    });

    it('should return true for nulls and empty', function() {
        var input = ['a', 'b', '', null];
        var response = helper.validateFileList(input);
        assert.equal(response, true);
    });

    it('should throw error for duplicates', function() {
        var input = ['a', 'b', 'c', 'a'];
        try {
            var response = helper.validateFileList(input);
            assert(false);
        } catch (err) {
            assert(true);
        }
    });
});
