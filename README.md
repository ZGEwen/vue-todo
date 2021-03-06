# Vue+Webpack打造todo应用

[慕课网Vue+Webpack打造todo应用](https://www.imooc.com/learn/935)

## 项目配置

### 项目初始化

创建了vue文件夹使用vscode打开；

`Ctrl+` ` 打开终端：

```
 npm init  //将项目初始化为npm项目
 npm i webpack vue vue-loader //安装webpack vue vue-loader
```

```
npm notice created a lockfile as package-lock.json. You should commit this file.       ust install peer dependencies yourself.
npm WARN vue-loader@15.7.0 requires a peer of css-loader@* but none is installed. You must install peer dependencies yourself.
npm WARN vue-ssr@1.0.0 No description
```

```
根据提示安装
npm i css-loader@*
```

至此，项目初始化完毕；

**但是这样安装的是webpack4.X版本，和3.x有很大区别；在这里直接参照`package.json`文件中的版本号，然后运行`npm install`**

### 创建src文件夹作为源码目录

1. 创建app.vue中书写基本的vue结构   

2. 首先在webpack.config.js设置入口entry   声明入口文件index.js

3. 示例中app.vue实际是一个组件,组件是不能直接挂载到html中去,需要在index.js中挂载

4. webpack.config.js同样设置出口文件bundle.js及存放路径；webpack将静态资源打包到js文件中

5. 因为webpack只能处理js文件,且只识别ES5的语法,所以针对不同类型的文件,我们定义不同的识别规则,最终目的都是打包成js文件,需要在model中定义规则

   ```js
   module:{
       //因为webpack只能处理js文件,且只识别ES5的语法
       //所以针对不同类型的文件,我们定义不同的识别规则,最终目的都是打包成js文件
          rules:[
              {
                  //处理.vue文件
                  test: /\.vue$/,
                  loader: 'vue-loader'
              }
          ]
      }
   ```

6. 配置完后,在package.json中配置build运行脚本, --config 指定我们的config文件 因为在这里面写,当你调用时才会调用这个项目里面的webpack,否则将会调用全局的webpack,全局webpack和项目中的版本可能存在差异,建议使用这种方式

   ```js
   "build": "webpack --config webpack.config.js"
   ```

7. 运行`npm run build`，可以看到在dist文件夹中生成了bundle.js文件

### 其他静态资源的处理

#### css文件

1. css-loader：处理css文件，读取css文件中的内容
2. style-loader：把css文件写到html文件中，最终以一段js代码出现

#### 图片

loader: 'url-loader',每个loader都是可以配置的，url-loader可以把图片转换为base64的代码直接写到js内容中，而不生成图片，对于小图片可以减少http请求。

url-loader，封装了file-loader，把图片读取然后做操作，指定大小，小于这个值时，就写到js中，超过了就以定义的名字输出。*输出文件的名字,[name] 文件原名,[ext]文件扩展名.*

#### css预处理器

 如stylus，

```js
{
               test: /\.styl/,
               use:[
                   'style-loader',
                   'css-loader',
                   //  处理.styl文件，处理之后是css文件，交给上一层处理  
                   'stylus-loader'
               ]
           },
```

### webpack-dev-server的配置

npm i webpack-dev-server@2.9.7

```js
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config webpack.config.js",
    "dev": "webpack-dev-server --config webpack.config.js"
  }
```

同一个配置文件,那么其中必然会根据一个环境变量判断,来判断是开发环境还是正式环境   
NODE_ENV就是这个环境变量,在linux下 直接NODE_ENV=production,在windows环境下 需要set NODE_ENV=production,解决这种跨平台设置的差异性,我们可以安装`npm i cross-env@5.1.3`,解决在不同平台下配置不同导致不生效的问题。

```js
    "build": "cross-env NODE_ENV=production webpack --config webpack.config.js",
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js"
```

目前编译的文件只有js、图片等，没有html文件作为入口。

在webpack.config.js配置好测试环境后,还需要引入一个html-webpack-plugin,用于将打包好后的js融入到html中。

`npm i html-webpack-plugin@2.30.1 `

#### config.devtool

帮助开发者在页面上调试代码。.vue和ES6的代码无法直接在浏览器中运行，直接在浏览器中调试，代码是经过编译过后的，无法直接找到自己写的内容。

使用代码映射。`config.devtool = '#cheap-module-eval-source-map'  `

## VUE2介绍

### 数据绑定

把JavaScript中object的数据直接绑定到html上，数据发生改变时，html中的内容也会发生改变

### VUE文件开发方式

组件化的框架

### render方法

用以更新html内容

### API重点

生命周期方法：组件的编译，加载，销毁

computed：对于reactive更深入的使用

## 项目搭建

安装postcss等： `npm i post i postcss-loader@2.0.9 autoprefixer@7.2.3 babel-loader@7.1.2 babel-core@6.26.0`

在根目录下创建配置文件：`.babelrc`配置babel  `postcss.config.js`配置postcss

postcss后处理css文件，css已经编译完成了，使用postcss优化css代码

babelrc：处理.jsx文件。需要安装`npm i babel-helper-vue-jsx-merge-props@^2.0.0 babel-plugin-syntax-jsx@^6.8.0` `npm i babel-preset-env@1.6.1 babel-plugin-transform-vue-jsx@3.5.0`，并在webpack配置中加上相应的配置。

1. 新建todo文件夹，创建header.vue文件和其他组件。
2. 新建样式，并在index.js中引入。
3. 虚化背景。PS：vue的template中必须有一个独立的外部节点，不能在template存在两个并列的节点
4. 在app中引入header组件，并在componts中进行声明，这样就可以在templae中进行使用

数据操作放到顶层中，**注意书写格式，否则会出现莫名错误**。

## 配置CSS单独分离打包

1. 安装：`npm i extract-text-webpack-plugin@^3.0.2`

2. 在`webpack.config.js`中引入`extract-text-webpack-plugin` 将非js的单独打包成静态资源文件

   ```js
   const ExtractPlugin = require("extract-text-webpack-plugin")
   ```

3. 区分配置`webpack.config.js中`的开发环境和正式环境。vue中的样式并没有打包到css文件中。

4. 使用`npm run build`打包。

## 区分打包类库代码及hash优化

希望浏览器尽可能长的缓存静态文件，类库代码比较稳定，业务代码经常更新迭代，希望利用浏览器更长时间的缓存来减少服务器的流量和提升用户的加载速度，单独出来进行打包。

```js
config.entry = {
   app: path.join(__dirname,'src/index.js'),
   vendor: ['vue'] 
}
config.plugins.push(
        new ExtractPlugin('styles.[contentHash:8].css'),//定义打包分离出的css文件名
        new webpack.optimize.CommonsChunkPlugin({//定义静态文件打包
            name: 'vendor'
        })
)
```

```js
 new webpack.optimize.CommonsChunkPlugin({
 //将app.js文件中一些关于webpack文件的配置单独打包出为一个文件,在有新的模块加入时，webpack给每个模块加上id，此时加入的模块顺序可能是在中间，会导致后边的每一个模块的id都发生变化，会导致打包出来的hash发生一定的变化，想要浏览器长缓存的作用就失去了效果，使用这个方法用于解决部分浏览器长缓存问题.注意;要放到vendor的后边。
    name: 'runtime'
})
```

## 总结

1. webpack
2. vue的重点不是api和指令，而是过程