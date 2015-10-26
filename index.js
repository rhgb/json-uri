'use strict';
/**
 * 单字符分隔符
 * [注意]出于兼容性考虑, 该字段只允许向后添加新项, 不得删除或改变原有项
 * @type {string[]}
 */
var SINGLE_DELIMITERS = '",:{}[]'.split('');
/**
 * 多字符分隔符
 * [注意]出于兼容性考虑, 该字段只允许向后添加新项, 不得删除或改变原有项
 * @type {string[]}
 */
//var COMPLEX_DELIMITERS = ['","', '":"', ':{"', '"},'];
var COMPLEX_DELIMITERS = [ '":', ',"', '","', '":"', '":{"', '"},"'];

var CANDIDATE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_!~*\'()'.split('');
var SECTION_DELIMITER = '-';
var RESERVED_CHARS = '.0123456789'; // reserved for future usages

var singleLen = SINGLE_DELIMITERS.length;
var complexLen = COMPLEX_DELIMITERS.length;
/**
 * Find single-character vacancies of a string
 * @param {string} str
 * @param {number} [size]
 * @returns {string[]}
 */
function findSingleVacancies(str, size) {
    var vacs = [];
    for (var i = 0; i < CANDIDATE_CHARS.length; i++) {
        if (str.indexOf(CANDIDATE_CHARS[i]) < 0) {
            vacs.push(CANDIDATE_CHARS[i]);
            if (size && vacs.length >= size) break;
        }
    }
    return vacs;
}
/**
 * Find
 * @param {string} str
 * @param {number} [size]
 * @returns {string[]}
 */
function findDoubleVacancies(str, size) {

    var vacs = [];
    for (var i = 0; i < CANDIDATE_CHARS.length; i++) {
        for (var j = 0; j < CANDIDATE_CHARS.length; j++) {
            if (i != j) {
                var pair = CANDIDATE_CHARS[i] + CANDIDATE_CHARS[j];
                if (str.indexOf(pair) < 0) {
                    vacs.push(pair);
                    if (size && vacs.length >= size) break;
                }
            }
        }
    }
    return vacs;
}
/**
 * Encode JSON string
 * @param {string} str
 * @returns {string}
 */
function encode(str) {
    var i;
    var vacs = findSingleVacancies(str, singleLen + complexLen);
    var singleReplacements = vacs.slice(0, singleLen);
    var complexReplacements = vacs.slice(singleLen);
    var dest = str;
    // first replace complex delimiters
    for (i = COMPLEX_DELIMITERS.length - 1; i >= 0; i--) {
        if (i < complexReplacements.length) {
            dest = dest.split(COMPLEX_DELIMITERS[i]).join(complexReplacements[i]);
        }
    }
    // then replace single delimiters
    for (i = 0; i < singleReplacements.length; i++) {
        dest = dest.split(SINGLE_DELIMITERS[i]).join(singleReplacements[i]);
    }
    // concatenate with replacement map
    dest = singleReplacements.join('') + SECTION_DELIMITER + complexReplacements.join('') + SECTION_DELIMITER + dest;
    return dest;
}
function decodeError(msg) {
    throw new SyntaxError(msg);
}
/**
 *
 * @param {string} str
 * @returns {string}
 */
function decode(str) {
    var i;
    var sec1 = str.indexOf(SECTION_DELIMITER);
    var sec2 = str.indexOf(SECTION_DELIMITER, sec1 + 1);
    // syntax check
    if (sec1 < 0 || sec2 < 0) decodeError('Cannot find section delimiter');
    if (sec1 > singleLen || sec2 - sec1 - 1 > complexLen) decodeError('Delimiter map lenth too large: sec1=' + sec1 + ', sec2=' + sec2);
    // split string
    var singleReplacements = str.slice(0, sec1).split('');
    var complexReplacements = str.slice(sec1 + 1, sec2).split('');
    var content = str.slice(sec2 + 1);
    // decode single delimiters
    for (i = 0; i < singleReplacements.length; i++) {
        content = content.split(singleReplacements[i]).join(SINGLE_DELIMITERS[i]);
    }
    // decode complex delimiters
    for (i = 0; i < complexReplacements.length; i++) {
        content = content.split(complexReplacements[i]).join(COMPLEX_DELIMITERS[i]);
    }
    return content;
}

module.exports = {
    encode: encode,
    decode: decode
};