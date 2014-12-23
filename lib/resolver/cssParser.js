// Built-in
var path = require('path');
var fs = require('fs');

// 3rd
var css = require('css');

// Custom
var utils = require('../utils');
var unique = utils.unique;
var res = require('./cssUrlRes');
var ResourceTable = require('../resource/table');


// local vars
var tree = {};
var codes = {};
var sequence = [];


/**
 *
 * @param startPath
 * @param encoding
 */
function loop(startPath, encoding) {
  if (sequence.indexOf(startPath) > -1) {
    return;
  }

  sequence.push(startPath);

  // read entry point file
  var content = utils.readFile(startPath, { encoding: encoding });
  var ast = css.parse(content);

  if (ast.stylesheet && ast.stylesheet.rules) {
    var deps = [];
    for (var i = 0; i < ast.stylesheet.rules.length; ++i) {
      var rule = ast.stylesheet.rules[i];
      if (rule.type === 'import') {
        var _path = res.getImportUrl(rule.import)[0];
        var dir = path.dirname(startPath);
        var absPath = path.resolve(dir, _path);
        deps.push(absPath);
        // remove
        ast.stylesheet.rules.splice(i, 1);
        i--;
      } else if (rule.type === 'rule') {
        rule.declarations.forEach(function(declaration) {
          var ret;
          // todo modify declaration.position.end.column
          // url("../img/a.png") no-repeat;
          // border-image:url(../img/a.png) 30 30 round;
          if (res.BACKGROUND_IMAGE.test(declaration.property) ||
            res.BORDER_IMAGE.test(declaration.property)) {
            ret = res.getBgImages(declaration.value);
            if (ret.length) {
              ret.forEach(function(url) {
                var u = path.resolve(path.dirname(startPath), url);
                // get the final path
                var p = ResourceTable.getResource('img', u).distPath;
                // calc the relative path to dist combo file
                var f = path.relative(path.dirname(SOI_CONFIG.dist_dir + '/' +
                  SOI_CONFIG.dist_css_file), p).replace(/\\/g, '/');

                declaration.value = declaration.value.replace(url, f);
              });
            }
          }

          if (res.FILTER.test(declaration.property)) {
            ret = res.getFilters(declaration.value);
            if (ret.length) {
              ret.forEach(function(url) {
                // relative from app.html
                var u = path.resolve(SOI_CONFIG.output_base, url);
                // get the final path
                var p = ResourceTable.getResource('img', u).distPath;
                // calc the relative path to dist combo file
                var f = path.relative(SOI_CONFIG.output_base + '/', p)
                    .replace(/\\/g, '/');

                declaration.value = declaration.value.replace(url, f);
              });
            }
          }
        });
      }
    }

    codes[startPath] = css.stringify(ast, { compress: true });

    if (!tree[startPath]) {
      tree[startPath] = deps;
    }
    deps.forEach(function(absPath) {
      loop(absPath, encoding);
    });
  }
}


// build the tree
function constructTree(node) {
  var visited = [];
  function t(deps) {
    // 'cause will reverse
    // here first reverse it [a,b] -> [b,a]
    deps = deps.reverse();
    visited = visited.concat(deps);
    deps.forEach(function(dep) {
      t(tree[dep] || []);
    });
  }

  visited.push(node);
  t(tree[node] || []);

  unique(visited.reverse());
  return visited;
}


/**
 * Calculate css module dependency
 * @param {String} entry
 * @param {String} encoding
 * @return {Array.<String>} Return
 */
function parse(entry, encoding) {
  loop(entry, encoding);
  return constructTree(sequence[0]);
}


/**
 * we could provide a way to reset all calc.
 * Or just for test.
 */
function clear() {
  tree = {};
  codes = {};
  sequence = [];
}


exports.parse = parse;
exports.clear = clear;
exports.codes = codes;