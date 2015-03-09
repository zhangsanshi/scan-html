'use strict';

var cheerio = require("cheerio");
var fs = require("fs");
var path = require('path');

module.exports = function (file, base, dest) {

    var $ = cheerio.load(file),
        result = {
            js: {},
            css: {},
            copy: { //部分文件可能不需要压缩,仅仅作为copy对象
                js: [],
                css: []
            }
        };

    /**
     * 删除测试文件，外围元素class为scanDelete
     */
    function deleteUrl () {
        $('.scanDelete').remove();
    }

    /**
     * 替换url \ 为 /
     * @param url
     * @returns {string}
     */
    function normalize (url) {
        return url.replace(/\\/g, '/');
    }

    /**
     * 获取资源文件相对于gruntfile路径
     * @param url
     * @returns {string}
     */
    function getAbsPath (url) {

        return normalize(path.join(base, url));
    }

    /**
     * 先把所有的js，css都获取，后面方法去除需要合并的那些，剩下的就是仅仅需要copy的
     */
    function getAllUrl () {
        deleteUrl(); // 先删除那些用于测试的文件
        var js = $('script'),
            css = $('link'),
            i = 0,
            len = js.length,
            url;
        for (; i < len; i++) {
            url = $(js[i]).attr('src');
            result.copy.js.push(getAbsPath(url));
        }
        for (i = 0, len = css.length; i < len; i++) {
            url = $(css[i]).attr('href');
            result.copy.css.push(getAbsPath(url));
        }

    }

    /**
     * 替换合并块为合并元素
     * @param type
     * @param path
     * @param scan
     */
    function replace(type, path, scan) {
        var cssEle = '<link rel="stylesheet">',
            jsEle = '<script></script>',
            temp;
        if (type === 'css') {
            temp = $(cssEle);
            temp.attr('href', path);

        }
        if (type === 'js') {
            temp = $(jsEle);
            temp.attr('src', path);
        }
        scan.after(temp);
        scan.remove();
    }

    /**
     * 获取合并块下的links
     * @param type
     * @param children
     * @returns {Array}
     */
    function getLinks(type, children) {

        var links = [],
            i = 0,
            len = children.length,
            copy = result.copy,
            child, url, index, attr;
        if (type === 'js') {
            attr = "src";
        } else {
            //css
            attr = "href";
        }

        for (; i < len; i++) {
            child = $(children[i]);

            url = getAbsPath(child.attr(attr));
            index = copy[type].indexOf(url);

            links.push(url);

            //删除copy里的存储
            if (index !== -1) {
                copy[type].splice(index, 1);
            }
        }
        return links;
    }

    /**
     * 总方法获取合并块下的总内容
     * @param scans
     * @returns {{js: {}, css: {}, copy: {js: Array, css: Array}}}
     */
    function getPath(scans) {

        function getScanInfo (merge) {
            var ext = path.extname(merge); // 扩展名
            return {
                type: (ext[0] === '.') ? ext.substring(1) : ext, //类型
                alias: path.basename(merge, ext)                 // 返回值属性别名
            }

        }

        var len = scans.length,
            i = 0,
            scan,    // 待扫描的元素集合
            merge,   // 获取元素的 data-merge 值，即合并后的文件名
            type,
            scanInfo;
        for (; i < len; i++) {
            scan = $(scans[i]);
            merge = scan.data().merge;
            scanInfo = getScanInfo(merge);
            type = scanInfo.type;
            if (type in result) {
                result[type][scanInfo.alias] = {
                    src: getLinks(type, scan.children()),          //获取该处合并下面的源文件名
                    dist: normalize(path.join(dest, base, merge))      //放在外文件夹的生成目录下
                };
                //把此处的静态资源块替换成合并后的资源
                replace(type, merge, scan);
            }
        }
        return result;
    }
    function scanHtml () {
        getAllUrl();
        return getPath($('.scanHtml'));
    }
    return {
        result: scanHtml(),
        html: $.html()
    };
};