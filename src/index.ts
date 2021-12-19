/**
 * 基于Canvas的弹幕插件
 * By.2021-12-17 22:12
 */
type MessageStyle = {
  color: string,
  fontSize: string,
  fontFamily: string
}

type Message = {
  x: number,
  y: number,
  id: string,
  text: string,
  speed: number,
  style: MessageStyle
}

export default class Barrage {
  private cvs: HTMLCanvasElement // canvas元素
  private target: HTMLElement  // 实现弹幕的目标元素
  private ctx!: CanvasRenderingContext2D // canvas实例
  private list: Array<Message> // 弹幕的集合
  private rId: number | undefined // requestAnimationFrame返回的标识

  constructor(selector: string) {
    this.cvs = document.createElement('canvas')
    const target = document.querySelector(selector) as HTMLElement
    if (!target) {
      throw new Error('ReferenceError: selector is not exist.')
    }
    this.target = target
    this.list = [] 
    this.init()
  }

  /**
   * 当添加完弹幕后，执行后进行动画
   */
  run() {
    if (this.rId) {
      cancelAnimationFrame(this.rId)
    }
    this.animate()
  }

  /**
   * 添加一条弹幕到弹幕列表中去
   * @param message 弹幕对象
   * @returns 当前实例
   */
  addMessage(message: Message): Barrage {
    const {
      fontSize = '20px',
      fontFamily = 'Microsoft YaHei',
      color = '#fff'
    } = message.style || {}
    const [x, y] = this.getPositoin(parseInt(fontSize))
    this.list.push({
      x,
      y,
      id: String(Math.ceil(Math.random() * 1000)) + y + message.speed * y,
      text: message.text,
      speed: message.speed || 3,
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
   * 获取生成的弹幕坐标点
   * @returns 返回坐标点集合
   */
  private getPositoin(fontSize: number): [number, number] {
    const x = this.cvs.width
    const y = Math.random() * (this.cvs.height - fontSize)
    return [Math.floor(x), Math.floor(y)]
  }

  /**
   * 弹幕移动动画
   * @returns void
   */
  private animate() {
    if (!this.list.length) {
      this.rId && cancelAnimationFrame(this.rId)
      return
    }
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height)
    const ids: Array<string> = []
    for (const [idx, item] of this.list.entries()) {
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
    this.list = this.list.filter((message: Message) => !ids.includes(message.id))
    this.rId = requestAnimationFrame(this.animate.bind(this))
  }
}
