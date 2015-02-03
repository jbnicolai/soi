var chai = require('chai');
var expect = chai.expect;
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');

var base = require('../../base');
var utils = require(base.optimizer_dir + '/utils');
var ResourceTable = require(base.optimizer_dir + '/resource/table');
var ModuleManager = require(base.optimizer_dir + '/module/manager');
var optimizer = require(base.optimizer_dir + '/index');

describe('duplicated async cases', function() {

  before(function () {
    require(base.soi_path);
    soi.config.extend({
      optimizer: {
        base_dir: __dirname + '/',
        module_loader: base.optimizer_dir + 'kernel.js',
        dist_dir: './dupAsyncSeq/dist/',
        bundles: {
          js: [
            {
              input: './dupAsyncSeq/main.js',
              files: null,
              exclude: {},
              defer: false,
              dist_file: 'main.js',
              dist_dir: './dupAsyncSeq/dist/'
            }
          ]
        }
      }
    });
    soi().use(optimizer).go();
  });

  after(function () {
    optimizer.reset();
    soi().reset();
    rimraf.sync(path.join(__dirname, 'dupAsyncSeq/dist/'), function (err) {});
  });

  // 主模块
  it('#main entry resource', function () {
    var id = utils.normalizeSysPath(
      path.join(soi().ENV.config.optimizer.base_dir +
        './dupAsyncSeq/main.js'));

    var rsc = ResourceTable.getResource('js', id);
    expect(rsc).to.be.an('object');
    expect(rsc.path).to.equal(utils.normalizeSysPath(
      path.join(soi().ENV.config.optimizer.base_dir +
        './dupAsyncSeq/main.js')
    ));
    expect(rsc.type).to.equal('js');
    expect(rsc.origin).to.equal(null);
  });

  // 主模块
  it('#main entry package', function () {
    var id = utils.normalizeSysPath(
      path.join(soi().ENV.config.optimizer.base_dir +
        './dupAsyncSeq/main.js'));

    var pkg = ResourceTable.getPackageByPath('js', id);
    expect(pkg).to.be.an('object');
    expect(pkg).to.have.property('files').with.length(5);
    expect(fs.existsSync(pkg.dist_file)).to.equal(true);
  });

  // 异步模块
  it('#async part', function () {
    id = utils.normalizeSysPath(
      path.join(soi().ENV.config.optimizer.base_dir +
        './dupAsyncSeq/c.js'));

    var mod_p = ModuleManager.getModuleByPath(id);
    expect(mod_p).to.be.an('object');

    rsc = ResourceTable.getPackageByPath('js', id);
    expect(rsc).to.be.null();
  });

});