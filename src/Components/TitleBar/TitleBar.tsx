import React, { FC } from "react";
import { WindowDispatch, WindowState } from "../../libs/WindowManager";
import { Icon, Icons } from "../Icon";
import { Root } from "./TitleBar.styled";

type Props = {
  /**
   * Active Style
   *
   * @type {boolean}
   */
  active?: boolean;
  state?: WindowState;
  dispatch?: WindowDispatch;
  onMouse?: (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ) => void;
};

/**
 * TitleBar
 *
 * @param {Props} { active, children }
 */
export const TitleBar: FC<Props> = ({
  active,
  children,
  state,
  onMouse,
  dispatch,
}) => {
  return (
    <Root
      className={[active && "active", state].join(" ")}
      onMouseDown={onMouse}
      onTouchStart={onMouse}
    >
      <div className="text">{children}</div>
      {state !== "min" && (
        <Icon
          type="button"
          src={Icons.Min}
          onClick={() => dispatch?.({ type: "state", payload: "min" })}
        />
      )}
      {state && state !== "normal" && (
        <Icon
          type="button"
          src={Icons.Normal}
          onClick={() => dispatch?.({ type: "state", payload: "normal" })}
        />
      )}
      {state !== "max" && (
        <Icon
          type="button"
          src={Icons.Max}
          onClick={() => dispatch?.({ type: "state", payload: "max" })}
        />
      )}
      <Icon
        type="button"
        src={Icons.Close}
        onClick={() => dispatch?.({ type: "state", payload: "close" })}
      />
    </Root>
  );
};
