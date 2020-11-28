import { BorderType } from "../../Components/Border";

/**
 *位置設定用
 *
 * @export
 * @interface Point
 */
export interface Point {
  x: number;
  y: number;
}
/**
 * サイズ設定用
 */
export interface Size {
  width: number;
  height: number;
}
/**
 * ドラッグドロップ機能用
 *
 * @export
 * @interface MoveParams
 * @param {Point} basePoint     クリック基準位置
 * @param {Point} relativePoint 移動相対位置
 * @param {Point} nodePoint     ノード初期位置
 * @param {Size}  nodeSize       ノード初期サイズ
 * @param {Size}  distance       ピッチ距離
 * @param {Size}  radian         ピッチ方向
 */
export interface MoveParams {
  event: MouseEvent | TouchEvent;
  basePoint: Point;
  relativePoint: Point;
  nodeType: BorderType | "";
  nodePoint: Point;
  nodeSize: Size;
  distance?: number;
  radian?: number;
}
export interface MEvent extends Event {
  params?: unknown;
}
/**
 * ウインドウ等総合管理クラス
 *
 * @export
 * @class WindowManager
 */
export class WindowManager {
  private static nodePoint: Point = { x: 0, y: 0 };
  private static basePoint: Point = { x: 0, y: 0 };
  private static nodeSize: Size = { width: 0, height: 0 };
  private static moveNode: HTMLElement | null = null;
  private static pinchiBaseDistance?: number;
  private static initFlag = false;
  private static nodeType: string;

  /**
   * マウスとタッチイベントの座標取得処理
   * @param  {MouseEvent|TouchEvent} e
   * @returns {Point} マウスの座標
   */
  public static getPos(e: MouseEvent | TouchEvent): Point {
    if ("targetTouches" in e) {
      const { pageX: x, pageY: y } = e.targetTouches[0];
      return { x, y };
    } else {
      return { x: e.clientX, y: e.clientY };
    }
  }
  /**
   * ノードに対してイベントを発生させる
   *
   * @static
   * @param {HTMLElement} node 対象ノード
   * @param {string} ename イベント名
   * @param {*} [params] イベント発生時にevent.paramsの形で送られる
   * @memberof WindowManager
   */
  public static callEvent(
    node: HTMLElement,
    ename: string,
    params?: unknown
  ): void {
    node.dispatchEvent(WindowManager.createEvent(ename, params));
  }
  /**
   *イベントを作成する
   *
   * @static
   * @param {string} ename イベント名
   * @param {*} [params] イベント発生時にevent.paramsの形で送られる
   * @returns {Event} 作成したイベント
   * @memberof WindowManager
   */

  private static createEvent(ename: string, params?: unknown): Event {
    let event: CustomEvent & { params?: unknown };
    try {
      event = new CustomEvent(ename);
    } catch (e) {
      event = document.createEvent("CustomEvent");
      event.initCustomEvent(ename, false, false, null);
    }
    if (params) {
      event.params = params;
    }
    return event;
  }
  /**
   *ノードを作成する
   *
   * @static
   * @param {string} tagName タグ名
   * @param {*} [params] タグパラメータ
   * @returns {HTMLElement} 作成したノード
   * @memberof WindowManager
   */
  public static createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    params?: object
  ): HTMLElementTagNameMap[K] {
    const tag: HTMLElementTagNameMap[K] = document.createElement(tagName);
    if (params) {
      for (const index in params) {
        const p = params[index as keyof object];
        if (typeof p === "object" && p) {
          for (const index2 of Object.keys(p)) {
            tag[index as keyof typeof tag][index2 as keyof object] =
              p[index2 as keyof object];
          }
        } else {
          tag[index as keyof typeof tag] = p as typeof tag[keyof typeof tag];
        }
      }
    }
    return tag;
  }
  public static init() {
    if (typeof window !== "undefined" && !this.initFlag) {
      this.initFlag = true;
      addEventListener("mouseup", WindowManager.mouseUp, false);
      addEventListener("touchend", WindowManager.mouseUp, { passive: false });
      addEventListener("mousemove", WindowManager.mouseMove, false);
      addEventListener("touchmove", WindowManager.mouseMove, {
        passive: false,
      });
      addEventListener("touchstart", WindowManager.onTouchStart, {
        passive: false,
      });
    }
  }
  static setNode(
    node: HTMLElement | null,
    nodeType: string,
    e: MouseEvent | TouchEvent,
    point: { x: number; y: number },
    size: { width: number; height: number }
  ) {
    WindowManager.moveNode = node;
    WindowManager.nodeType = nodeType;
    WindowManager.basePoint = WindowManager.getPos(e);
    WindowManager.nodePoint = { ...point };
    WindowManager.nodeSize = { ...size };
  }
  static isNode() {
    return WindowManager.moveNode !== null;
  }
  // マウスが離された場合に選択をリセット
  static mouseUp(): void {
    WindowManager.moveNode = null;
  }
  // マウス移動時の処理
  static mouseMove(e: MouseEvent | TouchEvent): void {
    if (WindowManager.moveNode) {
      if ("touches" in e && e.touches.length === 2) {
        if (WindowManager.pinchiBaseDistance === undefined) {
          WindowManager.pinchiBaseDistance = WindowManager.getDistance(
            e.touches
          );
        } else {
          const node = WindowManager.moveNode; // 移動中ノード
          const p = WindowManager.getPos(e); // 座標の取得
          const distance =
            WindowManager.getDistance(e.touches) -
            WindowManager.pinchiBaseDistance;
          const radian = WindowManager.getRadian(e.touches);
          const params: MoveParams = {
            event: e,
            nodeType: WindowManager.nodeType,
            nodePoint: WindowManager.nodePoint,
            basePoint: WindowManager.basePoint,
            relativePoint: { x: p.x, y: p.y },
            nodeSize: WindowManager.nodeSize,
            distance,
            radian,
          };
          WindowManager.callEvent(node, "move", params);
        }
        e.preventDefault();
      } else {
        const node = WindowManager.moveNode; // 移動中ノード
        const p = WindowManager.getPos(e); // 座標の取得
        const params: MoveParams = {
          event: e,
          nodeType: WindowManager.nodeType,
          nodePoint: WindowManager.nodePoint,
          basePoint: WindowManager.basePoint,
          relativePoint: { x: p.x, y: p.y },
          nodeSize: WindowManager.nodeSize,
        };
        WindowManager.callEvent(node, "move", params);
        e.preventDefault();
      }
    }
  }
  static getDistance(p: TouchList) {
    const x = p[0].pageX - p[1].pageX;
    const y = p[0].pageY - p[1].pageY;
    return Math.sqrt(x * x + y * y);
  }
  static getRadian(p: TouchList) {
    const x = p[0].pageX - p[1].pageX;
    const y = p[0].pageY - p[1].pageY;
    return Math.atan2(y, x);
  }
  static onTouchStart(e: TouchEvent) {
    WindowManager.pinchiBaseDistance = undefined;
  }
}
