
fis.config.set('settings.spriter.csssprites', {
    //开启模板内联css处理,默认关闭
    htmlUseSprite: true,
    //默认针对html原生<style></style>标签内的内容处理。
    //用户可以通过配置styleTag来扩展要识别的css片段
    //以下是默认<style></style>标签的匹配正则
    styleReg: /(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(<\/style\s*>|$)/ig
    //**styleReg规则**
    //1. 默认不配置styleReg，仅支持html中默认style标签中的css内容
    //2. 配置styleReg时候，仅支持styleReg匹配到的内容。
    //3. styleReg正则必须捕获三个分组，
    //     $1为：开始标签（start tag），
    //     $2为：内容(content) ,
    //     $3为：结束标签(end tag)
}) 
 
// 启用 fis-spriter-csssprites 插件
fis.match("::package", {
    spriter: fis.plugin("csssprites", {
        //使用矩阵排列方式，默认为线性`linear`
        layout: 'matrix',
        margin: 20
    })
})  

//autoprefixer 用到的包 fis-postprocessor-autoprefixer

var fileSrc = "" //"static/"
var src = "" //"/mobile/"
var name = "" //站点的文件名

var getTime = +new Date  
   
    // 对 CSS 进行图片合并
fis.match("*.{css,scss}", {
        useSprite: true  // 给匹配到的文件分配属性 `useSprite` 
    })
    //sass预处理,npm包fis3-parser-node-sass
    .match("*.scss", {
        postprocessor: fis.plugin("autoprefixer"),
        parser: fis.plugin("node-sass", {
            sourceMap: false
        }),
        //useSprite: true,  // 给匹配到的文件分配属性 `useSprite`
        rExt: ".css",       
        release: "../" + fileSrc + "$0"
    })

    .match("*.js", {
      release: "/" + fileSrc + "$0"
    })
    .match("*.css", {
        postprocessor: fis.plugin("autoprefixer"),
        //useSprite: true,  // 给匹配到的文件分配属性 `useSprite`
        release: "/" + fileSrc + "$0"
    })
    .match("*.{png,jpg,gif}", {
        release: "/$0"
    })
    .match('*.html:css', { //内嵌的 css  添加前缀
        //useSprite: true,  // 给匹配到的文件分配属性 `useSprite`
        postprocessor: fis.plugin("autoprefixer")
    })
    .match("*.html", {
        release: "/$0"
    })
    .match('/css/(*.png)', {
        release: '/images/$0'
    })
    .match('/(*.png)', {
        release: '/images/$0'
    })
    //压缩图片(没觉得压了多少，还不如用gulp的gulp-imagemin)
    .match("*.png", {
        optimizer: fis.plugin("png-compressor", {
			type: "pngquant"
		})
    })

fis.media("sass")
	.match("*.scss", {
        postprocessor: fis.plugin("autoprefixer"),
        parser: fis.plugin("node-sass", {
            sourceMap: false
        }),
        //useSprite: true,  // 给匹配到的文件分配属性 `useSprite`
        rExt: ".css",       
        release: "./" + fileSrc + "$0"
    })

fis.media("min")
    .match("*.css", {    //压缩 css
        postprocessor: fis.plugin("autoprefixer"),      
        optimizer: fis.plugin("clean-css"),
        rExt: ".min.css"
    }).match('*.html:css', { //压缩内嵌的 css
        postprocessor: fis.plugin("autoprefixer"),
        optimizer: fis.plugin('clean-css')
    }).match(src + "*.js", { //压缩 js
        optimizer: fis.plugin("uglify-js"),
        rExt: ".min.js"
    }).match('*.html:js', { //压缩内嵌的 js 
      optimizer: fis.plugin('uglify-js')
    })
	
	


	

//添加时间戳 大多数人以md5戳的方式，如下
fis.match("*.{css,png,js,jpg,mp4,mp3}", {
    //useHash: true
    //query: "?v=" + getTime      
})

/*
//加md5戳
fis.match('*.{js,css,jpg,png}', {
  useHash: true
})
*/




//开发环境下不需要压缩、合并、hash时，使用media方式
fis.media('debug').match('*.{js,css,png,jpg,gif}', {
    useHash: false,
    useSprite: false,  
    optimizer: null
})


fis.match('/{.vscode,node_modules,middleware,service,views}/**', {
  // 设置 release 为 FALSE，不再产出此文件
  release: false
})

fis.match("/static/{images,js}/**", {
	release: false
})
fis.match("*.{js,json,gitignore}", {
	release: false
})
















