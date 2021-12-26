/**
 * 基于Canvas的弹幕插件
 * By.2021-12-17 22:12
 */
enum MessageType {
  normal,
  layer
}

type LayerStyle = {
  x: number,
  y: number,
  placement?: string,
  time?: number
  removing?: boolean
}

type MessageStyle = {
  color?: string,
  fontSize?: string,
  fontFamily?: string
}

type Message = {
  x?: number,
  y?: number,
  id?: string,
  text: string,
  speed?: number,
  type?: MessageType,
  style?: MessageStyle,
  layerStyle?: LayerStyle
}

class Barrage {
  private cvs: HTMLCanvasElement // canvas元素
  private target: HTMLElement  // 实现弹幕的目标元素
  private ctx!: CanvasRenderingContext2D // canvas实例
  private list: Array<Message> = [] // 弹幕的集合
  private rId: number = 0 // requestAnimationFrame返回的标识
  private isListen: boolean = false // 是否执行在监听有弹幕加入
  private listenerTimer: number | null = null // 监听的定时器
  private maxMessage: number = 1500 // 最大渲染弹幕数量

  static normal = MessageType.normal
  static layer = MessageType.layer

  constructor(selector: string) {
    this.cvs = document.createElement('canvas')
    const target = document.querySelector(selector) as HTMLElement
    if (!target) {
      throw new Error('ReferenceError: selector is not exist.')
    }
    this.target = target
    this.init()
  }

  /**
   * 当添加完弹幕后，执行后进行动画
   */
  run() {
    this.handleListenr()
  }

  /**
   * * 添加一条弹幕到弹幕列表中去
   * @param message 弹幕对象，可以为string或者Message对象
   * @returns 当前实例
   */
  addMessage(message: string): Barrage | void;
  addMessage(message: Message): Barrage | void;
  addMessage(message: Message | string): Barrage | void;
  addMessage(message: Message | string): Barrage | void {
    if (this.list.length > this.maxMessage * 2) {
      return
    }
    if (typeof message === 'string') {
      const _message: Message = { text: message }
      message = _message
    }
    // 初始化弹幕样式
    if (!message.style) {
      message.style = {}
    }
    !message.style.fontSize && (message.style.fontSize = '20px')
    !message.style.fontFamily && (message.style.fontFamily = 'Microsoft YaHei') 
    !message.style.color && (message.style.color = '#fff') 
    !message.speed && (message.speed = 3)
    // 判断弹幕类型
    const layerStyle: LayerStyle = { x: 0, y: 0 }
    if (message.type === MessageType.layer) {
      const style = message.layerStyle as LayerStyle
      layerStyle.x = style.x
      layerStyle.y = style.y
      layerStyle.time = style.time || 3000
      layerStyle.placement = style.placement
    } else {
      message.type = MessageType.normal
    }
    // 初始化弹幕位置
    const [x, y] = this.getPositoin(message)
    this.pushMessage({
      x,
      y,
      id: String(Math.ceil(Math.random() * 1000)) + y + message.speed * y,
      text: message.text,
      speed: message.speed,
      style: message.style,
      type: message.type,
      layerStyle
    })
    return this
  }

  /**
   * 添加多条弹幕到弹幕列表中去
   * @param messages 弹幕对象集合
   * @returns 当前实例
   */
  addMessages(messages: Array<Message> | Array<string>): Barrage {
    messages.forEach((message: Message | string) => this.addMessage(message))
    return this
  }

  /**
   * 清除当前弹幕列表里的弹幕
   */
  clear() {
    this.list = []
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height)
  }

  /**
   * 暂停发射弹幕，会移除掉监听
   */
  stop() {
    this.listenerTimer && clearInterval(this.listenerTimer)
    this.listenerTimer = null
    this.rId && cancelAnimationFrame(this.rId)
  }

  /**
   * 初始化：元素的宽高、和canvas实例
   */
  private init() {
    const width = this.target.offsetWidth
    const height = this.target.offsetHeight
    this.cvs.width = width
    this.cvs.height = height
    this.target.setAttribute('style', 'position: relative;')
    this.cvs.setAttribute('style', 'position: absolute; pointer-events: none; left: 0; top: 0; z-index: 9999;')
    this.ctx = this.cvs.getContext('2d') as CanvasRenderingContext2D
    this.target.appendChild(this.cvs)
  }

  /**
   * 将弹幕推入弹幕列表
   * @param message 弹幕对象
   */
  private pushMessage(message: Message) {
    this.list.push(message)
  }
 
  /**
   * 获取生成的弹幕坐标点
   * @returns 返回坐标点集合
   */
  private getPositoin(message: Message): [number, number] {
    let x = 0, y = 0, fontSize = parseInt((message.style as MessageStyle).fontSize as string)
    if (message.type === MessageType.normal) {
      x = this.cvs.width
      y = Math.random() * (this.cvs.height - fontSize)
    } else if (message.type === MessageType.layer) {
      const layerStyle = message.layerStyle as LayerStyle
      if (layerStyle.placement) {
        x = Math.ceil(this.cvs.width / 2)
        switch(layerStyle.placement) {
          case 'top':
            y = fontSize
            break
          case 'center':
            y = Math.ceil((this.cvs.height - fontSize) / 2)
            break
          case 'bottom':
            y = Math.ceil(this.cvs.height - 2 * fontSize)
            break
          default:
            y = Math.ceil(this.cvs.height / 2)
        }        
      } else {
        x = layerStyle.x
        y = layerStyle.y
      }
    }
    return [Math.floor(x), Math.floor(y)]
  }
  
  /**
   * 监听弹幕数据是否有新添加的数据
   */
  private handleListenr() {
    if (this.isListen) {
      return
    }
    this.isListen = true
    if (this.list.length) {
      this.handleAnimate()
      return
    }
    this.listenerTimer = setInterval(() => {
      this.handleAnimate()
    }, 1e3)
  }

  /**
   * 执行动画方法
   */
  private handleAnimate() {
    if (this.list.length > 0) {
      this.rId && cancelAnimationFrame(this.rId)
      this.animate()
      this.isListen = false
      this.listenerTimer && clearInterval(this.listenerTimer)
    }
  }

  /**
   * 弹幕移动动画
   * @returns void
   */
  private animate() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height)
    if (!this.list.length) {
      this.rId && cancelAnimationFrame(this.rId)
      this.handleListenr()
      return
    }
    const ids: Array<string> = [], list = this.list.slice(0, this.maxMessage)
    for (const item of list as Array<{
      x: number,
      y: number,
      id: string,
      text: string,
      speed: number,
      style: {
        color: string,
        fontSize: string,
        fontFamily: string
      },
      type: MessageType,
      layerStyle: LayerStyle
    }>) {
      item.type === MessageType.normal && (item.x -= item.speed)
      if (item.x >= this.cvs.width) {
        continue
      }
      const { color, fontSize, fontFamily } = item.style
      this.ctx.beginPath()
      this.ctx.font = `${fontSize} ${fontFamily}`
      this.ctx.fillStyle = color
      this.ctx.fillText(item.text, item.x, item.y + parseInt(item.style.fontSize))
      if (item.type === MessageType.normal) {
        const { width } = this.ctx.measureText(item.text)
        if (item.x <= -width) {
          ids.push(item.id)
        }
      } else if (item.type === MessageType.layer) {
        !ids.includes(item.id) && ids.push(item.id)
      } 
    }
    // 放在循环外删除，否则会造成闪烁
    ids.forEach((id: string) => {
      const idx = this.list.findIndex((item: Message) => item.id === id)
      const target = this.list[idx]
      if (target.type === MessageType.normal) {
        idx >= 0 && this.list.splice(idx, 1)
      } else {
        const layerStyle = target.layerStyle as LayerStyle
        if (!layerStyle.removing) {
          setTimeout(() => {
            // 重新获取下标，之前下标会因为异步原因不准确
            const idx = this.list.findIndex((item: Message) => item.id === id)
            idx >= 0 && this.list.splice(idx, 1)
          }, layerStyle.time)
          layerStyle.removing = true
        }
      }
    })
    this.rId = requestAnimationFrame(this.animate.bind(this))
  }
}

export default Barrage
