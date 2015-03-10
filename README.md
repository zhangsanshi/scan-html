# grunt-scan-html

> scan html get static resource

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-scan-html --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-scan-html');
```

## The "scan_html" task

### Overview
In your project's Gruntfile, add a section named `scan_html` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  scan_html: {
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```
### Note
在你的html里需要用一个标签来包裹需要合并的块，并添加相应的属性，除此之外的js,css默认仅作为复制使用

#### 需要删除的块，添加class:scanDelete

```html
<div class="scanDelete">
    <script src="js/app2.js"></script>
</div>
```
#### 需要合并的块，添加class:scanHtml，并添加属性data-merge(合并后的文件名)

```html
<div class="scanHtml" data-merge="css/default1.css" >
        <link rel="stylesheet" href="css/layout2.css" >
        <link rel="stylesheet" href="css/common2.css" >
    </div>
```

### Options

#### options.src
Type: `String`
Default value: `""`

html文件的路径.

#### options.dest
Type: `String`
Default value: `""`

结果文件的目录.

#### options.fromCache
Type: `Boolean`
Default value: `false`

如果该html文件未更改且缓存存在，则可以直接从上次缓存中读取.

### Usage Examples

#### not from cache
这个例子里，会在tmp下生成扫描后的文件，可在Gruntfile里访问 <%= scanResult.js/css.你的合并文件名.src/dist %>(压缩js,css) '<%= scanHtml.src/dest %>'(压缩html用)

```js
grunt.initConfig({
  scan_html: {
     task1: {
        options: {
            src: "test/test.html",
            dest: "tmp/",
            fromCache: false
        }
    }
  },
});
```

#### from cache
在这个例子里，会读取tmp下的缓存，同样可以访问上个例子的那些参数

```js
grunt.initConfig({
  scan_html: {
    task2: {
        options: {
            src: "test/test.html",
            dest: "tmp/",
            fromCache: true
        }
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
