import React, { FC, useEffect, useRef, useState } from "react";
import { Border, Borders, BorderType } from "../Border";
import { Client } from "../Client";
import { TitleBar } from "../TitleBar";
import { Root } from "./Win.styled";
import {
  MEvent,
  MoveParams,
  WindowManager,
} from "./../../libs/WindowManager/WindowManager";

type Props = {
  title?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  moveable?: boolean;
};

type WindowValues = {
  active: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Win
 *
 * @param {Props} { }
 */
export const Win: FC<Props> = ({
  title,
  x,
  y,
  width,
  height,
  children,
  moveable,
}) => {
  const refWindow = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<WindowValues>({
    active: false,
    x: x ?? 0,
    y: y ?? 0,
    width: width ?? 640,
    height: height ?? 480,
  });
  useEffect(() => {
    const node = refWindow.current as HTMLDivElement;
    node.addEventListener("move", onMove);
    node.addEventListener("active", onActive);
    return () => {
      node.removeEventListener("move", onMove);
    };
  }, []);
  return (
    <Root
      ref={refWindow}
      {...values}
      data-__symbol="Window"
      onMouseDown={() => foreground()}
    >
      <TitleBar active={values.active} onMouse={onMouseDown}>
        {title}
      </TitleBar>
      <Client>{children}</Client>
      <Border onMouse={onMouseDown} />
    </Root>
  );
  function onActive(e: MEvent) {
    const active = e.params === true;
    setValues((values) => ({ ...values, active }));
    const node = refWindow.current!;
    if (active) {
      const parent = node.parentNode;
      if (parent) {
        node.style.zIndex = "99999";

        Array.prototype.slice
          .call(parent.childNodes, 0)
          .filter((node) => isWindow(node))
          .sort((a, b) => {
            const az = a.style.zIndex ? parseInt(a.style.zIndex) : 0;
            const bz = b.style.zIndex ? parseInt(b.style.zIndex) : 0;
            return az - bz;
          })
          .forEach((node, index) => {
            node.style.zIndex = index.toString();
          });
      }
    }
  }
  function onMove(e: MEvent) {
    const p = e.params as MoveParams;
    let px = p.nodePoint.x;
    let py = p.nodePoint.y;
    let pwidth = p.nodeSize.width;
    let pheight = p.nodeSize.height;
    const deltaX = p.relativePoint.x - p.basePoint.x;
    const deltaY = p.relativePoint.y - p.basePoint.y;

    switch (p.nodeType) {
      case "top":
        py = p.nodePoint.y + deltaY;
        pheight -= deltaY;
        break;
      case "right":
        pwidth += deltaX;
        break;
      case "bottom":
        pheight += deltaY;
        break;
      case "left":
        px = p.nodePoint.x + deltaX;
        pwidth -= deltaX;
        break;
      case "leftTop":
        px = p.nodePoint.x + deltaX;
        py = p.nodePoint.y + deltaY;
        pwidth -= deltaX;
        pheight -= deltaY;
        break;
      case "rightTop":
        py += deltaY;
        pwidth += deltaX;
        pheight -= deltaY;
        break;
      case "leftBottom":
        px += deltaX;
        pwidth -= deltaX;
        pheight += deltaY;
        break;
      case "rightBottom":
        pwidth += deltaX;
        pheight += deltaY;
        break;
      default:
        px += deltaX;
        py += deltaY;
        break;
    }

    setValues((values) => ({
      ...values,
      x: px,
      y: py,
      width: pwidth,
      height: pheight,
    }));
  }
  function onMouseDown(
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ) {
    if (!WindowManager.isNode()) {
      foreground();
      const node = e.target as HTMLElement;
      const className = node.className;
      const border = Borders.includes(className as BorderType);
      if (moveable !== false || border)
        WindowManager.setNode(
          refWindow.current,
          border ? className : "",
          e.nativeEvent,
          values,
          values
        );
    }
    e.stopPropagation();
  }
  /**
   *ウインドウをフォアグラウンドにする
   *
   * @memberof
   */
  function foreground(): void {
    //Activeになるノードを取得
    const activeNodes = new Set<HTMLElement>();
    let node: HTMLElement | null = refWindow.current;
    if (node) {
      let topNode: HTMLElement = node;
      do {
        if (isWindow(node)) {
          activeNodes.add(node);
          topNode = node;
        }
      } while ((node = node.parentNode as HTMLElement));
      const parent = topNode.parentNode;
      if (parent) {
        const sendActive = (node: HTMLElement & { _symbol?: Symbol }) => {
          if (isWindow(node)) {
            const act = activeNodes.has(node);
            WindowManager.callEvent(node, "active", act);
          }
          Array.prototype.forEach.call(node.childNodes, (node) => {
            sendActive(node as HTMLElement);
          });
        };
        sendActive(parent as HTMLElement);
      }
    }
  }
  function isWindow(node: HTMLElement) {
    return node.dataset?.["__symbol"] === "Window";
  }
};

WindowManager.init();
