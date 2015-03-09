/*
 * grunt-scan-html
 * https://github.com/zhangsanshi/scan-html
 *
 * Copyright (c) 2015 zhangsanshi
 * Licensed under the MIT license.
 */

'use strict';



module.exports = function(grunt) {

    var path = require('path');
    var scan = require("./lib/scan-html");

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('scan_html', 'scan html get static resource', function() {

      var ops = this.options(),
          src = ops.src,
          dest = ops.dest,
          fromCache = ops.fromCache, //是否从缓存的文件读取
          srcDirName, resultPath;

      /**
       * 获取扫描后结果存储的路径
       *    noExt: 无后缀名  ,扫描后的文件路径
       *    html: 后缀名html, 替换后的html地址
       *    json: 后缀名json, 扫描后缓存结果文件的储存地址
       * @param dest 目标目录
       * @param src  源文件路径
       * @returns {{noExt: (XML|string|void|*), html: string, json: string}}
       */
      function getResultPath (dest, src) {
          var extname = path.extname(src),
              noExt = path.resolve(dest, src).replace(extname, "");
          return {
              noExt: noExt,
              html: noExt + '.html',
              json: noExt + '.json'
          };
      }

      if (!grunt.file.exists(src)) {
          return grunt.log.warn('Source file "' + src + '" not found.');
      } else {
          srcDirName = path.dirname(src);
          resultPath = getResultPath(dest, src);
      }

      //fromCache不用扫描html文件，直接从上次生成的json文件里读取
      if (fromCache && grunt.file.exists(resultPath.json)) {
          grunt.config("scanResult", grunt.file.readJSON(resultPath.json));
      } else {
          (function () {

              var scanHtml = scan(grunt.file.read(src), srcDirName, dest); //获取扫描结果

              grunt.file.write(resultPath.json, JSON.stringify(scanHtml.result, null, '\t'));
              grunt.file.write(resultPath.noExt, scanHtml.html);
              grunt.config("scanResult", scanHtml.result);
          })();
      }

      //用于html文件压缩配置
      grunt.config("scanHtml", {
          src: resultPath.noExt,
          dest: resultPath.html
      });
      grunt.log.ok('scan is ok.');
  });

};
