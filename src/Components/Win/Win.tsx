import React, { FC, useRef } from "react";
import { Border } from "../Border";
import { Client } from "../Client";
import { TitleBar } from "../TitleBar";
import { Root } from "./Win.styled";
import { useWindow } from "./../../libs/WindowManager";

type Props = {
  title?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  moveable?: boolean;
};

/**
 * Win
 *
 * @param {Props} { }
 */
export const Win: FC<Props> = ({ title, x, y, width, height, children }) => {
  const refWindow = useRef<HTMLDivElement>(null);
  const { params, handleWindow } = useWindow({
    ref: refWindow,
    active: false,
    x: x ?? 0,
    y: y ?? 0,
    width: width ?? 640,
    height: height ?? 480,
  });

  return (
    <Root ref={refWindow} {...params} onMouseDown={handleWindow}>
      <TitleBar active={params.active} onMouse={handleWindow}>
        {title}
      </TitleBar>
      <Client>{children}</Client>
      <Border onMouse={handleWindow} />
    </Root>
  );
};
