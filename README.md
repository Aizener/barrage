## 一个基于canvas的弹幕插件

> 使用canvas编写的一个弹幕插件，目前功能比较单一，只是支持弹幕的字体大小、颜色、速度功能。

## 安装

安装`simple-canvas-barrage`的方式有两种，一种是通过仓库来下载依赖，另一种是通过使用`cdn`来引入。

### 通过npm或者yarn仓库引用

通过包仓库安装的依赖，是`typescript`编写的，所以需要对应的`typescript`支持。

- 使用`npm`安装：
  
  ```shell
  npm install --save simple-canvas-barrage
  ```
- 使用`yarn`安装
  
  ```shell
  yarn add simple-canvas-barrage
  ```

### 通过`jsdelivr cdn`引入

通过`cdn`引入是编译好的`javascript`文件，包含`umd`和`esm`两种模块。

- 使用`umd`模块
  
  ```html
  <script src="https://cdn.jsdelivr.net/gh/Aizener/barrage@master/dist/index.umd.js"></script>
  ```
- 使用`esm`模块
  
  ```html
  <script type="module">
  import Barrage from 'https://cdn.jsdelivr.net/gh/Aizener/barrage@master/dist/index.esm.js'
  </script>
  ```

## 使用

使用`simple-canvas-barrage`的方式非常简单，只需要两步：

1. 找到需要加载弹幕插件的容器，获取对应的选择器；
2. 实例`Barrage`类，并添加弹幕并执行`run`方法即可发送弹幕。

```js
const barrage = new Barrage('.app')
barrage.addMessages({ text: '这是一条弹幕' }).run()
```

上述`run`方法可以再任意时刻执行，该方法并不是表示添加弹幕后再发射弹幕。而是，表示该弹幕插件已启动，随时添加弹幕随时可被发射出去，这个时间是插件内部的一个定时器所规定的时间，目前为`1000ms`。所以，下面写法一样有效：

```js
const barrage = new Barrage('.app')
barrage.run()
barrage.addMessages({ text: '这是一条弹幕' })
```

**注意：`run`方法不要多次执行！**

### 方法

| 方法          | 作用                                        |
|:-----------:|:-----------------------------------------:|
| addMessage  | 添加一条弹幕， 类型：<a href="#message">Message</a> |
| addMessages | 添加多条弹幕                                    |
| run         | 启动弹幕插件，会监听是否有弹幕数据的添加，并发射添加的弹幕             |

### 类型

#### <span id="message">Message</span>

| 属性    | 作用          | 默认值                                         |
|:-----:|:-----------:|:-------------------------------------------:|
| text  | 弹幕文字内容      | -                                           |
| speed | 弹幕的速度，像素为单位 | 3                                           |
| style | 弹幕的样式       | 见：<a href="#message-style">MessageStyle</a> |

#### <span id="message-style">MessageStyle</span>

| 属性         | 作用    | 默认值             |
|:----------:|:-----:|:---------------:|
| color      | 弹幕颜色  | #fff            |
| fontSize   | 弹幕的大小 | 20px            |
| fontFamily | 弹幕的字体 | Microsoft YaHei |
