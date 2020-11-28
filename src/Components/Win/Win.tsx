import React, { FC, useEffect, useRef, useState } from "react";
import { Border } from "../Border";
import { Client } from "../Client";
import { TitleBar } from "../TitleBar";
import { Root } from "./Win.styled";
import {
  MEvent,
  MovePoint,
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
    <Root ref={refWindow} {...values}>
      <TitleBar onMouse={onMouseDown}>{title}</TitleBar>
      <Client>{children}</Client>
      <Border />
    </Root>
  );
  function onActive(e: MEvent) {
    console.log(e);
  }
  function onMove(e: MEvent) {
    const p = e.params as MovePoint;
    const deltaX = p.nodePoint.x + p.nowPoint.x - p.basePoint.x;
    const deltaY = p.nodePoint.y + p.nowPoint.y - p.basePoint.y;
    setValues({ ...values, x: deltaX, y: deltaY });
  }
  function onFrame(
    e:
      | React.TouchEvent<HTMLDivElement>
      | React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void {
    if (WindowManager.frame == null) WindowManager.frame = e.currentTarget.id;
  }
  function onMouseDown(
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ) {
    if (WindowManager.moveNode == null) {
      //this.foreground();
      if (moveable !== false) {
        WindowManager.moveNode = refWindow.current;
        let p = WindowManager.getPos((e as unknown) as MouseEvent | TouchEvent);
        WindowManager.baseX = p.x;
        WindowManager.baseY = p.y;
        WindowManager.nodeX = values.x;
        WindowManager.nodeY = values.y;
        WindowManager.nodeWidth = values.width;
        WindowManager.nodeHeight = values.height;
      }
    }
    e.stopPropagation();
  }
};

WindowManager.init();
