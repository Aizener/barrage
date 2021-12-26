## 一个基于canvas的弹幕插件

> 使用canvas编写的一个弹幕插件，目前功能比较单一，只是支持弹幕的字体大小、颜色、速度功能。

## 安装

安装`simple-canvas-barrage`的方式有两种，一种是通过仓库来下载依赖，另一种是通过使用`cdn`来引入。

### 通过npm或者yarn仓库引用

该插件支持`typescript`，通过包仓库安装的依赖。  
因为插件自动插入需要生成弹幕的元素，所以会对目标元素进行侵入式的修改：**将会把目标元素的`position`设置为`relative`**。

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

### 初始化

使用`simple-canvas-barrage`的方式非常简单，只需要两步：

1. 找到需要加载弹幕插件的容器，获取对应的选择器；
2. 实例`Barrage`类，并添加弹幕并执行`run`方法即可发送弹幕。

```js
const barrage = new Barrage('.app')
barrage.addMessages({ text: '这是一条弹幕' }).run()
```

上述`run`方法可以再任意时刻执行，该方法并不是表示添加弹幕后再发射弹幕。  
而是，表示该弹幕插件已启动，随时添加弹幕随时可被发射出去，这个时间是插件内部的一个定时器所规定的时间，目前为`1000ms`。所以，下面写法一样有效：

```js
const barrage = new Barrage('.app')
barrage.run()
barrage.addMessages({ text: '这是一条弹幕' })
```

**注意：`run`方法不要多次执行！**

### 其他

目前，`Barrage`的最大渲染弹幕数量是`1500`条弹幕，超过这个数量的弹幕只能在当前弹幕消失之后再进行渲染；  

当存储弹幕列表的`list`数量超过`3000`时，既最大渲染量的两倍，再次执行`addMessage`时无法添加弹幕。

### 方法

| 方法          | 作用                                        |
|:-----------:|:-----------------------------------------:|
| addMessage  | 添加一条弹幕， 类型：<a href="#message">Message</a> |
| addMessages | 添加多条弹幕                                    |
| run         | 启动弹幕插件，会监听是否有弹幕数据的添加，并发射添加的弹幕             |
| clear       | 清除当前弹幕列表里面的数据（包括画布还未渲染的弹幕）                |
| stop        | 暂停插件的运行，若要回复则需要执行`run`方法                  |

### 类型

#### <span id="message">Message</span>

|    属性    |                             作用                             |                     默认                      |
| :--------: | :----------------------------------------------------------: | :-------------------------------------------: |
|    text    |                         弹幕文字内容                         |                       -                       |
|   speed    |                    弹幕的速度，像素为单位                    |                       3                       |
|   style    |                          弹幕的样式                          | 见：<a href="#message-style">MessageStyle</a> |
|    type    | 弹幕的显示方式，`normal`即从右往左移动；`layer`是直接显示在屏幕上 |                    normal                     |
| layerStyle | `type`为`layer`时需要传入，见：<a href="#layer-style">LayerStyle</a> |                       -                       |

#### <span id="message-style">MessageStyle</span>

| 属性         | 作用    | 默认值             |
|:----------:|:-----:|:---------------:|
| color      | 弹幕颜色  | #fff            |
| fontSize   | 弹幕的大小 | 20px            |
| fontFamily | 弹幕的字体 | Microsoft YaHei |

#### <span id="layer-style">LayerStyle</span>

|   属性    |                             作用                             | 默认值 |
| :-------: | :----------------------------------------------------------: | :----: |
|     x     |                    弹幕出现在屏幕的横坐标                    |   -    |
|     y     |                    弹幕出现在屏幕的纵坐标                    |   -    |
| placement | 弹幕出现的位置：`top`,`center`,`bottom`三个可选，设置该属性后，`x`和`y`将无效 |   -    |
|   time    |                        弹幕消失的时间                        | 3000ms |

