var path = require('path');
var fs = require('fs');

var chai = require('chai');
var expect = chai.expect;
var utils = require('../../lib/utils');
var rimraf = require('rimraf');

describe('getFileHash', function() {

  before(function() {
    global.SOI_CONFIG = {
      encoding : 'utf8',
      base_dir : __dirname + '/',
      debug:  true,
      sha1_length: 8
    };
  });

  after(function() {
    global.SOI_CONFIG = null;
  });

  it('#default sha1 length', function() {
    var foo = utils.getFileHash(
        __dirname + '/static/foo.js', SOI_CONFIG.encoding);
    var foo0 = utils.getFileHash(
        __dirname + '/static/foo0.js', SOI_CONFIG.encoding);
    var bar = utils.getFileHash(
        __dirname + '/static/bar.js', SOI_CONFIG.encoding);

    expect(foo).to.include.keys('content', 'hex');
    expect(foo0).to.include.keys('content', 'hex');
    expect(bar).to.include.keys('content', 'hex');

    expect(foo.hex).to.deep.equal(foo0.hex);
    expect(foo.content).to.deep.equal(foo0.content);
    expect(foo.hex).to.not.equal(bar.hex);
    expect(foo.content).to.not.equal(bar.hex);
  });

  it('#custom sha1 length', function() {
    var foo = utils.getFileHash(
        __dirname + '/static/foo.js', SOI_CONFIG.encoding);
    var foo0 = utils.getFileHash(
        __dirname + '/static/foo0.js', SOI_CONFIG.encoding);
    var bar = utils.getFileHash(
        __dirname + '/static/bar.js', SOI_CONFIG.encoding);

    SOI_CONFIG.sha1_length = 12;
    var foo_ = utils.getFileHash(
        __dirname + '/static/foo.js', SOI_CONFIG.encoding);
    var foo0_ = utils.getFileHash(
        __dirname + '/static/foo0.js', SOI_CONFIG.encoding);
    var bar_ = utils.getFileHash(
        __dirname + '/static/bar.js', SOI_CONFIG.encoding);

    expect(foo_.hex.substring(0, 8)).to.deep.equal(foo.hex);
    expect(foo0_.hex.substring(0, 8)).to.deep.equal(foo0.hex);
    expect(bar_.hex.substring(0, 8)).to.deep.equal(bar.hex);
  });

  it('#image file', function() {
    var icon = utils.getFileHash(__dirname + '/static/1168707.gif');
    var icon0 = utils.getFileHash(__dirname + '/static/1172143.gif');

    expect(icon).to.include.keys('content', 'hex');
    expect(icon0).to.include.keys('content', 'hex');
    expect(icon.hex).to.not.equal(icon0.hex);
    expect(icon.content).to.not.equal(icon0.hex);
  });

  it('#css file', function() {
    var css = utils.getFileHash(
        __dirname + '/static/icon.css', SOI_CONFIG.encoding);
    var css0 = utils.getFileHash(
        __dirname + '/static/icon0.css', SOI_CONFIG.encoding);

    expect(css).to.include.keys('content', 'hex');
    expect(css0).to.include.keys('content', 'hex');

    expect(css.hex).to.not.equal(css0.hex);
    expect(css.content).to.not.equal(css0.hex);
  });

});
