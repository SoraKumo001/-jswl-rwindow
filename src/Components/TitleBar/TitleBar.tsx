import React, { FC } from "react";
import { Icon, Icons } from "../Icon";
import { Root } from "./TitleBar.styled";

type State = "max" | "min" | undefined;

type Props = {
  /**
   * Active Style
   *
   * @type {boolean}
   */
  active?: boolean;
  state?: State;
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
export const TitleBar: FC<Props> = ({ active, children, state, onMouse }) => {
  return (
    <Root
      className={active ? "active" : undefined}
      onMouseDown={onMouse}
      onTouchStart={onMouse}
    >
      <div className="text">{children}</div>
      {state !== "min" && <Icon type="button" src={Icons.Min} />}
      {state && <Icon type="button" src={Icons.Normal} />}
      {state !== "max" && <Icon type="button" src={Icons.Max} />}
      <Icon type="button" src={Icons.Close} />
    </Root>
  );
};
