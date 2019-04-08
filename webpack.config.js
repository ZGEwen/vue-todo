// path是Nodejs中的基本包,用来处理路径
const path = require('path')

//判断是否为测试环境,在启动脚本时设置的环境变量都是存在于process.env这个对象里面的
const isDev = process.env.NODE_ENV === "development" 
//引入html-webpack-plugin
const HTMLPlugin = require('html-webpack-plugin')
//引入webpack
const webpack = require("webpack")
const config = {
    //设置webpack的编译目标是web平台
   target: "web",
    // 输入 声明js文件入口,__dirname就是我们文件的根目录,用join拼接
   entry: path.join(__dirname,'src/index.js'),
    // 输出 将挂载的App全部打包成一个bundle.js,在浏览器中可以直接运行的代码  
   output:{
       filename: 'bundle.js',
       path: path.join(__dirname,'dist')
   },
   module:{
    //因为webpack只能处理js文件,且只识别ES5的语法
    //所以针对不同类型的文件,我们定义不同的识别规则,最终目的都是打包成js文件
       rules:[
           {
               //处理.vue文件
               test: /\.vue$/,
               loader: 'vue-loader'
           },
           {
               test: /\.css$/,
               use:[
                   //将css的样式写入到html里面去,以一段js代码出现
                   'style-loader',
                   //处理css文件，读取css文件内容
                   'css-loader'
               ]
           },
           {
               test: /\.styl/,
               use:[
                   'style-loader',
                   'css-loader',
                //  处理.styl文件，处理之后是css文件，交给上一层处理  
                   'stylus-loader'
               ]
           },
           {    //处理图片
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use:[
                    {
                        //loader是可以配置选项的,如下options
                        loader: 'url-loader', 
                        options: {
                            //url-loader的好处是可以加一个限制的大小,对于小图片,在范围内可直接将图片转换成base64码直接存放在js中,以减少http请求. 
                            limit: 1024,
                            //输出文件的名字,[name] 文件原名,[ext]文件扩展名.
                            name: '[name].[ext]'      
                        }
                    }
                ]
           }
       ]
   },
   plugins:[
        //主要作用是在此处可以根据isdev配置process.env,一是可以在js代码中可以获取到process.env,
        new webpack.DefinePlugin({
            //二是webpack或则vue等根据process.env如果是development,会给一些特殊的错误提醒等,而这些特殊项在正式环境是不需要的
            'process.env':{
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPlugin()
   ]
}

if (isDev) {
    //这个devServer的配置是在webpack2.x以后引入的,1.x是没有的
    config.devServer = {
        //访问的端口号
        port: 8000,
        //可以设置0.0.0.0 ,这样设置可以通过127.0.0.1或则localhost去访问
        host: '0.0.0.0',                              
        overlay: {
            //编译中遇到的错误都会显示到网页中去
            errors: true,
        },
        // open: true ,//项目启动时,会默认帮你打开浏览器
        //在单页面应用开发中,我们修改了代码后是整个页面都刷新,开启hot后,将只刷新对应的组件
        hot: true 
    },
    //添加两个插件用于hot:true的配置
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
}

module.exports = config //声明一个config的配置,用于对外暴露