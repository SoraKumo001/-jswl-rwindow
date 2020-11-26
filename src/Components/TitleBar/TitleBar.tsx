import React, { FC } from "react";
import { Icon, Icons } from "../Icon";
import { Root } from "./TitleBar.style";

type State = "max" | "min" | undefined;

type Props = {
  /**
   * Active Style
   *
   * @type {boolean}
   */
  active?: boolean;
  state?: State;
};

/**
 * TitleBar
 *
 * @param {Props} { active, children }
 */
export const TitleBar: FC<Props> = ({ active, children, state }) => {
  return (
    <Root className={active ? "active" : undefined}>
      <div className="text">{children}</div>
      {state !== "min" && <Icon type="button" src={Icons.Min} />}
      {state && <Icon type="button" src={Icons.Normal} />}
      {state !== "max" && <Icon type="button" src={Icons.Max} />}
      <Icon type="button" src={Icons.Close} />
    </Root>
  );
};
