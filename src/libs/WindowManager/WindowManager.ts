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
 * @interface MovePoint
 * @param {Point} basePoint クリック基準位置
 * @param {Point} nowPoint 移動位置位置
 * @param {Point} nodePoint ノード初期位置
 * @param {Size} nodeSize ノード初期サイズ
 */
export interface MovePoint {
  event: MouseEvent | TouchEvent;
  basePoint: Point;
  nowPoint: Point;
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
  public static nodeX: number;
  public static nodeY: number;
  public static baseX: number;
  public static baseY: number;
  public static nodeWidth: number;
  public static nodeHeight: number;
  public static moveNode: HTMLElement | null = null;
  public static frame: string | null = null;
  public static pinchiBaseDistance?: number;
  private static initFlag = false;

  /**
   * マウスとタッチイベントの座標取得処理
   * @param  {MouseEvent|TouchEvent} e
   * @returns {Point} マウスの座標
   */
  public static getPos(e: MouseEvent | TouchEvent): Point {
    let p: Point;
    if (
      (e as TouchEvent).targetTouches &&
      (e as TouchEvent).targetTouches.length
    ) {
      const touch = (e as TouchEvent).targetTouches[0];
      p = { x: touch.pageX, y: touch.pageY };
    } else {
      p = { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    }
    return p;
  }
  /**
   * ノードに対してイベントを発生させる
   *
   * @static
   * @param {HTMLElement} node 対象ノード
   * @param {string} ename イベント名
   * @param {*} [params] イベント発生時にevent.paramsの形で送られる
   * @memberof Jwf
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
   * @memberof Jwf
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
   * @memberof Jwf
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
    if (window && !this.initFlag) {
      this.initFlag = true;
      window.addEventListener("mouseup", mouseUp, false);
      window.addEventListener("touchend", mouseUp, { passive: false });
      window.addEventListener("mousemove", mouseMove, false);
      window.addEventListener("touchmove", mouseMove, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: false });
    }
  }
}

// マウスが離された場合に選択をリセット
function mouseUp(): void {
  WindowManager.moveNode = null;
  WindowManager.frame = null;
}
// マウス移動時の処理
function mouseMove(e: MouseEvent | TouchEvent): void {
  if (WindowManager.moveNode) {
    if ("touches" in e && e.touches.length === 2) {
      if (WindowManager.pinchiBaseDistance === undefined) {
        WindowManager.pinchiBaseDistance = getDistance(e.touches);
      } else {
        const node = WindowManager.moveNode; // 移動中ノード
        const p = WindowManager.getPos(e); // 座標の取得
        const distance =
          getDistance(e.touches) - WindowManager.pinchiBaseDistance;
        const radian = getRadian(e.touches);
        const params: MovePoint = {
          event: e,
          nodePoint: { x: WindowManager.nodeX, y: WindowManager.nodeY },
          basePoint: { x: WindowManager.baseX, y: WindowManager.baseY },
          nowPoint: { x: p.x, y: p.y },
          nodeSize: {
            width: WindowManager.nodeWidth,
            height: WindowManager.nodeHeight,
          },
          distance,
          radian,
        };
        WindowManager.callEvent(node, "move", params);
      }
      e.preventDefault();
      // e.stopPropagation();
    } else {
      const node = WindowManager.moveNode; // 移動中ノード
      const p = WindowManager.getPos(e); // 座標の取得
      const params: MovePoint = {
        event: e,
        nodePoint: { x: WindowManager.nodeX, y: WindowManager.nodeY },
        basePoint: { x: WindowManager.baseX, y: WindowManager.baseY },
        nowPoint: { x: p.x, y: p.y },
        nodeSize: {
          width: WindowManager.nodeWidth,
          height: WindowManager.nodeHeight,
        },
      };
      WindowManager.callEvent(node, "move", params);
      e.preventDefault();
      // e.stopPropagation();
    }
  }
  // e.preventDefault();
}
function getDistance(p: TouchList) {
  const x = p[0].pageX - p[1].pageX;
  const y = p[0].pageY - p[1].pageY;
  return Math.sqrt(x * x + y * y);
}
function getRadian(p: TouchList) {
  const x = p[0].pageX - p[1].pageX;
  const y = p[0].pageY - p[1].pageY;
  return Math.atan2(y, x);
}
function onTouchStart(e: TouchEvent) {
  WindowManager.pinchiBaseDistance = undefined;
}
