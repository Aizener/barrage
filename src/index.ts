/**
 * 基于Canvas的弹幕插件
 * By.2021-12-17 22:12
 */
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
  style?: MessageStyle
}

class Barrage {
  private cvs: HTMLCanvasElement // canvas元素
  private target: HTMLElement  // 实现弹幕的目标元素
  private ctx!: CanvasRenderingContext2D // canvas实例
  private list: Array<Message> = [] // 弹幕的集合
  private rId: number = 0 // requestAnimationFrame返回的标识
  private isListen: boolean = false // 是否执行在监听有弹幕加入
  private listenerTimer: NodeJS.Timer | null = null // 监听的定时器
  private maxMessage: number = 1500 // 最大渲染弹幕数量


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
   * 添加一条弹幕到弹幕列表中去
   * @param message 弹幕对象
   * @returns 当前实例
   */
  addMessage(message: Message): Barrage | void {
    if (this.list.length > this.maxMessage * 2) {
      return
    }
    const {
      fontSize = '20px',
      fontFamily = 'Microsoft YaHei',
      color = '#fff'
    } = message.style || {}
    !message.speed && (message.speed = 3)
    const [x, y] = this.getPositoin(parseInt(fontSize))
    this.pushMessage({
      x,
      y,
      id: String(Math.ceil(Math.random() * 1000)) + y + message.speed * y,
      text: message.text,
      speed: message.speed,
      style: {
        color,
        fontSize,
        fontFamily
      }
    })
    return this
  }

  /**
   * 添加多条弹幕到弹幕列表中去
   * @param messages 弹幕对象集合
   * @returns 当前实例
   */
  addMessages(messages: Array<Message>): Barrage {
    messages.forEach((message: Message) => this.addMessage(message))
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
  private getPositoin(fontSize: number): [number, number] {
    const x = this.cvs.width
    const y = Math.random() * (this.cvs.height - fontSize)
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
    if (!this.list.length) {
      this.rId && cancelAnimationFrame(this.rId)
      this.handleListenr()
      return
    }
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height)
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
      }
    }>) {
      item.x -= item.speed
      if (item.x >= this.cvs.width) {
        continue
      }
      const { color, fontSize, fontFamily } = item.style
      this.ctx.beginPath()
      this.ctx.font = `${fontSize} ${fontFamily}`
      this.ctx.fillStyle = color
      this.ctx.fillText(item.text, item.x, item.y + parseInt(item.style.fontSize))
      const { width } = this.ctx.measureText(item.text)
      if (item.x <= -width) {
        ids.push(item.id)
      }
    }
    // 放在循环外删除，否则会造成闪烁
    ids.forEach((id: string) => {
      const idx = this.list.findIndex((item: Message) => item.id === id)
      idx > 0 && this.list.splice(idx, 1)
    })
    // this.list = this.list.filter((message: Message) => !ids.includes(message.id as string))
    this.rId = requestAnimationFrame(this.animate.bind(this))
  }
}

export default Barrage
