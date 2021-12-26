/**
 * 基于Canvas的弹幕插件
 * By.2021-12-17 22:12
 */
declare enum MessageType {
    normal = 0,
    layer = 1
}
declare type LayerStyle = {
    x: number;
    y: number;
    placement?: string;
    time?: number;
    removing?: boolean;
};
declare type MessageStyle = {
    color?: string;
    fontSize?: string;
    fontFamily?: string;
};
declare type Message = {
    x?: number;
    y?: number;
    id?: string;
    text: string;
    speed?: number;
    type?: MessageType;
    style?: MessageStyle;
    layerStyle?: LayerStyle;
};
declare class Barrage {
    private cvs;
    private target;
    private ctx;
    private list;
    private rId;
    private isListen;
    private listenerTimer;
    private maxMessage;
    static normal: MessageType;
    static layer: MessageType;
    constructor(selector: string);
    /**
     * 当添加完弹幕后，执行后进行动画
     */
    run(): void;
    /**
     * * 添加一条弹幕到弹幕列表中去
     * @param message 弹幕对象，可以为string或者Message对象
     * @returns 当前实例
     */
    addMessage(message: string): Barrage | void;
    addMessage(message: Message): Barrage | void;
    addMessage(message: Message | string): Barrage | void;
    /**
     * 添加多条弹幕到弹幕列表中去
     * @param messages 弹幕对象集合
     * @returns 当前实例
     */
    addMessages(messages: Array<Message> | Array<string>): Barrage;
    /**
     * 清除当前弹幕列表里的弹幕
     */
    clear(): void;
    /**
     * 暂停发射弹幕，会移除掉监听
     */
    stop(): void;
    /**
     * 初始化：元素的宽高、和canvas实例
     */
    private init;
    /**
     * 将弹幕推入弹幕列表
     * @param message 弹幕对象
     */
    private pushMessage;
    /**
     * 获取生成的弹幕坐标点
     * @returns 返回坐标点集合
     */
    private getPositoin;
    /**
     * 监听弹幕数据是否有新添加的数据
     */
    private handleListenr;
    /**
     * 执行动画方法
     */
    private handleAnimate;
    /**
     * 弹幕移动动画
     * @returns void
     */
    private animate;
}
export default Barrage;
