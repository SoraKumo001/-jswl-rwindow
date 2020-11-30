export type WindowState = "normal" | "max" | "min" | "close";
export type BorderType =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "leftTop"
  | "rightTop"
  | "rightBottom"
  | "leftBottom";

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
export type MoveParams =
  | {
      node: HTMLElement;
      basePoint: Point;
      relativePoint: Point;
      nodeType: BorderType | "";
      nodePoint: Point;
      nodeSize: Size;
      distance?: number;
      radian?: number;
    }
  | {
      node: null;
      nodePoint: Point;
      nodeSize: Size;
    };
export interface MEvent extends Event {
  params?: unknown;
}
