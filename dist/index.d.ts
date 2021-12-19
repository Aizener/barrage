/**
 * 基于Canvas的弹幕插件
 * By.2021-12-17 22:12
 */
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
    style?: MessageStyle;
};
export default class Barrage {
    private cvs;
    private target;
    private ctx;
    private list;
    private rId;
    constructor(selector: string);
    /**
     * 当添加完弹幕后，执行后进行动画
     */
    run(): void;
    /**
     * 添加一条弹幕到弹幕列表中去
     * @param message 弹幕对象
     * @returns 当前实例
     */
    addMessage(message: Message): Barrage;
    /**
     * 添加多条弹幕到弹幕列表中去
     * @param messages 弹幕对象集合
     * @returns 当前实例
     */
    addMessages(messages: Array<Message>): Barrage;
    /**
     * 初始化：元素的宽高、和canvas实例
     */
    private init;
    /**
     * 获取生成的弹幕坐标点
     * @returns 返回坐标点集合
     */
    private getPositoin;
    /**
     * 弹幕移动动画
     * @returns void
     */
    private animate;
}
export {};