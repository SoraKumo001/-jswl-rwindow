import React, {
  Dispatch,
  FC,
  MutableRefObject,
  useEffect,
  useRef,
} from "react";
import { Border } from "../Border";
import { Client } from "../Client";
import { TitleBar } from "../TitleBar";
import { Root } from "./Win.styled";
import {
  ActionType,
  useWindow,
  WindowParams,
  WindowState,
} from "./../../libs/WindowManager";

type Props = {
  title?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  moveable?: boolean;
  child?: boolean;
  state?: WindowState;
  dispatch?: MutableRefObject<Dispatch<ActionType>>;
  onUpdate?: (params: WindowParams) => void;
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
  child,
  state,
  children,
  dispatch: refDispatch,
  onUpdate,
}) => {
  const refWindow = useRef<HTMLDivElement>(null);
  const { params, handleWindow, dispatch } = useWindow(() => ({
    ref: refWindow,
    active: false,
    x: x ?? 0,
    y: y ?? 0,
    width: width ?? 640,
    height: height ?? 480,
    child: child === true,
    state: state ?? "hide",
  }));
  useEffect(() => {
    if (refDispatch) refDispatch.current = dispatch;
  }, [refDispatch]);
  useEffect(() => {
    onUpdate?.(params);
  }, [params]);
  return (
    <Root
      ref={refWindow}
      onMouseDown={handleWindow}
      style={{
        left: `${params.x}px`,
        top: `${params.y}px`,
        width: `${params.width}px`,
        height: `${params.height}px`,
        position: params.child ? "absolute" : "fixed",
      }}
    >
      <TitleBar
        active={params.active}
        state={params.state}
        onMouse={handleWindow}
        dispatch={dispatch}
      >
        {title}
      </TitleBar>
      <Border onMouse={handleWindow} />
      <Client state={params.state}>{children}</Client>
    </Root>
  );
};
