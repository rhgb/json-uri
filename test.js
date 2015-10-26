'use strict';
var assert = require('assert');
var j = require('./index');
var tests = [
    require('./test-data/short.json'),
    require('./test-data/normal.json'),
    require('./test-data/super.json'),
    require('./test-data/complex.json')
];
function cycleTest(obj) {
    var testStr = JSON.stringify(obj);
    var res = j.encode(testStr);
    var decoded = j.decode(res);
    var sl = testStr.length;
    var ol = encodeURIComponent(testStr).length;
    var el = encodeURIComponent(res).length;
    console.log(res.slice(0, res.indexOf('-', res.indexOf('-') + 1)),
        sl, ol, el,
        ((ol - el) / ol * 100).toFixed(1) + '% decreased,',
        (el / sl * 100).toFixed(1) + '% of original string');
    assert.strictEqual(decoded, testStr);
}
describe('encode-decode test', function () {
    it('decoded string should be equal to original string', function () {
        for (var i = 0; i < tests.length; i++) {
            cycleTest(tests[i]);
        }
    });
});