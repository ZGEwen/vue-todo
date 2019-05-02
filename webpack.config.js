// path是Nodejs中的基本包,用来处理路径
const path = require('path')

//判断是否为测试环境,在启动脚本时设置的环境变量都是存在于process.env这个对象里面的
const isDev = process.env.NODE_ENV === "development" 
//引入html-webpack-plugin
const HTMLPlugin = require('html-webpack-plugin')
//引入webpack
const webpack = require("webpack")

const ExtractPlugin = require("extract-text-webpack-plugin")

const config = {
    //设置webpack的编译目标是web平台
   target: "web",
    // 输入 声明js文件入口,__dirname就是我们文件的根目录,用join拼接
   entry: path.join(__dirname,'src/index.js'),
    // 输出 将挂载的App全部打包成一个bundle.js,在浏览器中可以直接运行的代码  
   output:{
       filename: 'bundle.[hash:8].js',
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
                //处理.jsx文件
                test: /\.jsx$/,
                loader: 'babel-loader'                  //处理jsx文件
            },
        //    {
        //        test: /\.css$/,
        //        use:[
        //            //将css的样式写入到html里面去,以一段js代码出现
        //            'style-loader',
        //            //处理css文件，读取css文件内容
        //            'css-loader'
        //        ]
        //    },
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
        new HTMLPlugin({
            title: 'Todo'
        })
   ]
}

if (isDev) {
    config.module.rules.push(
        {
            test: /\.styl/,
            use: [
                'style-loader',
                'css-loader',
                {
                    
                     loader: 'postcss-loader',
                     options: {
                         //stylus-loader和postcss-loader自己都会生成sourceMap,如果前面stylus-loader已生成了sourceMap
                         sourceMap: true,
                     }//那么postcss-loader可以直接引用前面的sourceMap
                 },
                 //  处理.styl文件，处理之后是css文件，交给上一层处理  
                'stylus-loader'
            ]
        }
    )
    // 帮助在浏览器中调试
    config.devtool = '#cheap-module-eval-source-map' 
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
}else{
    config.entry = {
        app: path.join(__dirname,'src/index.js'),
        vendor: ['vue']   
    }
    //此处一定是chunkhash,因为用hash时app和vendor的hash码是一样的了,这样每次业务代码更新,vendor也会更新,也就没有了意义.
    config.output.filename = '[name].[chunkhash:8].js'
    config.module.rules.push(
        {
            test: /\.styl/,
            use: ExtractPlugin.extract({
                fallback: 'style-loader',
                use: [
                    //css-loader处理css
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            //stylus-loader和postcss-loader自己都会生成sourceMap,如果前面stylus-loader已生成了sourceMap
                            sourceMap: true,
                        }//那么postcss-loader可以直接引用前面的sourceMap
                    },
                    //处理stylus的css预处理器的问题件,转换成css后,抛给上一层的css-loader
                    'stylus-loader'
                ]
            })
        },
    ), 
    config.plugins.push(
        //定义打包分离出的css文件名
        new ExtractPlugin('styles.[contentHash:8].css'),
        new webpack.optimize.CommonsChunkPlugin({
            //定义静态文件打包
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            //将app.js文件中一些关于webpack文件的配置单独打包出为一个文件,用于解决部分浏览器长缓存问题   
            name: 'runtime'
        })
    )
}

module.exports = config //声明一个config的配置,用于对外暴露